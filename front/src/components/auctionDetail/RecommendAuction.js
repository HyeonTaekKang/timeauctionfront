import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import DOMPurify from "dompurify";
import '../../css/components/auctionDetail/RecommendAuction.css';
import {noApi} from "../../api/axios";

const RecommendAuction = () => {

    const [auctionList, setAuctionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root      : null,
            rootMargin: '20px',
            threshold : 1.0,
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading]);

    const loadAuctions = async () => {
        setLoading(true);
        const lastId = auctionList.length > 0 ? auctionList[auctionList.length - 1].id : null;
        let requestURL = '/auction/recents';
        if (lastId) {
            requestURL += `?lastId=${lastId}`;
        }
        const response = await noApi.get(requestURL);
        const newAuctions = response.data.data.map((auction) => {
            const currentTime = new Date().getTime();
            const auctionEndTime = new Date(auction.endTime).getTime();
            const isExpired = currentTime > auctionEndTime;
            return {...auction, isExpired};
        });
        setAuctionList((prevAuctions) => [...prevAuctions, ...newAuctions]);
        setLoading(false);
        if (response.data.data.length === 0) {
            setHasMore(false);
        }
    };

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore && !loading) {
            loadAuctions();
        }
    };

    return (
        <div className="recommendAuction-list-container">
            {auctionList.map((auction, index) => (
                <Link to={`/auction/${auction.id}`} key={index} className="recommendAuction-item">
                    <div className="recommendAuction-thumbnail">
                        <img
                            className={`recommendAuction-thumbnail ${auction.isExpired ? 'expired' : ''}`}
                            src={`https://timeauction-auctionthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/` + `${auction.thumbNailUrl}`}
                            alt="Thumbnail"
                        />
                        {auction.isExpired && (
                            <div className="expired-overlay">
                                <span>경매 만료</span>
                            </div>
                        )}
                    </div>

                    <div className="recommendAuction-details">
                            <span className="recommendAuction-title">
                                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(auction.title)}}></div>
                            </span>

                        {/*<p className="recommendAuction-description">*/}
                        {/*    {DOMPurify.sanitize(auction.description, {*/}
                        {/*        ALLOWED_TAGS: [],*/}
                        {/*    })}s*/}
                        {/*</p>*/}

                        <div className="recommendAuction-info">
                            <div className="recommendAuction-highestBidAmount">최고 금액: {auction.highestBidAmount} 원</div>
                            <div className="recommendAuction-bidEndTime">종료일
                                : {new Date(auction.endTime).toLocaleDateString()}</div>
                        </div>
                    </div>
                </Link>
            ))}
            <div ref={loader}>
                {loading ? (
                    <></>
                ) : hasMore ? null : (
                    <></>
                )}
            </div>
        </div>
    )

};

export default RecommendAuction;
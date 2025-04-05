import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import '../../css/components/auctionList/AuctionList.css';
import {Link} from "react-router-dom";
import DOMPurify from "dompurify";
import {MdTimer} from "react-icons/md";
import {auctionApi, noApi} from "../../api/axios";

// auction 더보기
const AuctionList = () => {
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
            setAuctionList((prevAuctions) => [...prevAuctions, ...response.data.data]);
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
            <>
                <div className="auction-list-header">
                    <MdTimer size="19"/>
                    <span>시간 경매</span></div>
                <div className="auction-list-container">
                    {auctionList.map((auction, index) => (
                        <Link to={`/auction/${auction.id}`} key={index} className="auction-item">
                            <div className="auction-thumbnail">
                                <img src={`https://timeauction-auctionthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/` + `${auction.thumbNailUrl}`}/>
                            </div>
                            <div className="auctionList-auction-details">
                                <div className="auction-title">
                                    <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(auction.title)}}></div>
                                </div>

                                <p className="auction-description">
                                    {DOMPurify.sanitize(auction.description, {
                                        ALLOWED_TAGS: [],
                                    })}s
                                </p>

                                <div className="auction-info">
                                    <p>최고 금액: {auction.highestBidAmount} 원 </p>
                                    <p>종료일 : {new Date(auction.endTime).toLocaleString()}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div ref={loader}>
                        {loading ? (
                            <div className="loading-indicator"></div>
                        ) : hasMore ? null : (
                            <div className="no-more-items"></div>
                        )}
                    </div>
                </div>
            </>
        );
    }
;

export default AuctionList;
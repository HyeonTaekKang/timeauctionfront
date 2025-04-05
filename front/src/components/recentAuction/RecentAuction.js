import React from 'react';
import AuctionTimer from "../auctionTimer/AuctionTimer";
import '../../css/components/recentAuction/RecentAuction.css';
import {Link} from "react-router-dom";


const RecentAuction = ({recentAuction}) => {


    // const userIconImageUrl = `/userIcon/${recentAuction.userIconUrl.split("\\").pop()}`;

    const isAuctionExpired = (endTime) => {
        const currentTime = new Date().getTime();
        const auctionEndTime = new Date(endTime).getTime();
        return currentTime > auctionEndTime;
    };

    const isExpired = isAuctionExpired(recentAuction.endTime);

    const calculateHoursRemaining = () => {
        const now = new Date().getTime();
        const end = new Date(recentAuction.endTime).getTime();
        const timeLeft = end - now;

        if (timeLeft <= 0) {
            return 0;
        } else {
            return Math.ceil(timeLeft / (1000 * 60 * 60));
        }
    };

    return (<div id="auction-block">
            <Link to={`/auction/${recentAuction.id}`}>
                <div className="auction">
                    <div className="auction-thumbnail-block">
                        <img
                            className={`auction-thumbnail ${isExpired ? 'expired' : ''}`}
                            src={`https://timeauction-auctionthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/` + `${recentAuction.thumbNailUrl}`}
                            alt="Thumbnail"
                        />
                        {isExpired && (<div className="expired-overlay">
                            <span>이미 만료된 경매</span>
                        </div>)}
                    </div>
                    <div className="auction-detail-block">
                        <div className="auction-currentHighestAmount-block">
                            <span className="auction-currentHighestAmount">{recentAuction.highestBidAmount}</span>
                            <span>원</span>
                        </div>

                        <div className="auction-title">
                            <span dangerouslySetInnerHTML={{__html: recentAuction.title}}/>
                        </div>

                        <div className="auctionbid-count">
                            입찰 {recentAuction.bidCount}건
                        </div>


                        <div className="auction-metadata">
                        <span className="user-Info">
                        <span className="end-label">
                        종료
                    <span className="end-time" style={{color: '#989898'}}>{calculateHoursRemaining()}시간</span>
                </span>
            <div className="seller-info">
                     <span className="seller-label" style={{color: '#666', marginRight: '5px'}}>판매자</span>
                <span className="user-nickName">{recentAuction.nickName}</span>
                    </div>
                    </span>
                        </div>
                    </div>

                </div>
            </Link>
        </div>

    );
};

export default RecentAuction;
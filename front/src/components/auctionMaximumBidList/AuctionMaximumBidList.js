import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router-dom";
import '../../css/components/auctionMaximumBidList/AuctionMaximumBidList.css';
import moment from 'moment';
import {noApi, noApii, noTokenAuctionBidApi} from "../../api/axios";

const AuctionMaximumBidList = () => {
    const { auctionId } = useParams();
    const [auctionMaximumBidList, setauctionMaximumBidList] = useState(null);

    const fetchMaximumBidList = async () => {
        try {
            const response = await noApi.get(`/auction/maximum-bid/list/${auctionId}`);
            const auctionMaximumBidList = response.data;
            console.log(auctionMaximumBidList);
            setauctionMaximumBidList(auctionMaximumBidList);
        } catch (error) {
            console.error('Failed to fetch auctionMaximumBidList data:', error);
        }
    };

    // // 현재 최고 입찰금액 가져오기
    // const fetchMaximumBid = async () => {
    //     try {
    //         const response = await axios.get(`/auction-maximum-bid/${auctionId}`);
    //         const auctionMaximumBidList = response.data;
    //         console.log(auctionMaximumBidList);
    //         setauctionMaximumBidList(auctionMaximumBidList);
    //     } catch (error) {
    //         console.error('Failed to fetch auctionMaximumBidList data:', error);
    //     }
    // };

    useEffect(() => {
        fetchMaximumBidList();
    }, [auctionId]);

    return (
        <div className="container">
            <span className="container-head">입찰 내역</span>
            {auctionMaximumBidList === null ? (
                <div className="loading">로딩 중...</div>
            ) : auctionMaximumBidList.length === 0 ? (
                <div className="no-bids">입찰 내역이 없습니다.</div>
            ) : (
                <ul className="bid-list" style={{ maxHeight: '80px', overflowY: 'auto' }}>
                    {auctionMaximumBidList.map((bid, index) => (
                        <li key={bid.id} className="bid-item">
                            <div className="bid-index" >{index + 1}.</div>
                            <div className="bid-amount">{bid.highestBidAmount} 원</div>
                            <div className="bid-time">입찰 시간: {moment(bid.bidTime).format('YYYY-MM-DD HH:mm')}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AuctionMaximumBidList;
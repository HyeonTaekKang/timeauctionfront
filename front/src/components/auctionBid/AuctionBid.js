import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {api, apii, auctionBidApi, noApi, noApii, noTokenAuctionApi, noTokenAuctionBidApi} from "../../api/axios";
import '../../css/components/auctionBid/AuctionBid.css';
import axios from "axios";
import AuctionMaximumBidList from "../auctionMaximumBidList/AuctionMaximumBidList";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const AuctionBid = () => {
    const { auctionId } = useParams();

    const [isLoading, setIsLoading] = useState(false);

    const [auction, setAuction] = useState(null);
    const [currentHighestBidAmount, setCurrentHighestBidAmount] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        fetchCurrentHighestAmount();
        fetchAuction();

    }, [auctionId]);

    const fetchAuction = async () => {
        try {
            const response = await api.get(`/auction/${auctionId}`);
            const auction = response.data;

            console.log(auction)

            setAuction(auction)
        } catch (error) {
            console.error('Failed to fetch auction data:', error);
        }
    }


    const handleBidAmountChange = (e) => {
        // 숫자만 입력 가능하도록 처리
        const value = e.target.value.replace(/\D/g, '');
        setBidAmount(value);
    };

    const handleBidSubmit = async () => {

        // 사용자에게 경매 생성 확인
        const isConfirmed = window.confirm("입찰하시겠습니까?");

        if (!isConfirmed) {
            // 사용자가 취소를 선택한 경우 함수 종료
            return;
        }

        setIsLoading(true);
        try {

            const response = await api.post(`/auctionbid/${auctionId}`, {
                bidAmount,
            });

            // 응답이 성공인 경우
            if (response.data.success) {
                setIsLoading(false);
                // 성공 메시지 표시
                alert(response.data.message);
                // '/'로 리다이렉트
                navigate('/')
            } else if(!response.data.success){
                alert(response.data.message) // 입찰금액이 현재 최고 입찰금보다 적은 경우
            }
            else {
                // 에러 메시지 표시
                setIsLoading(false);
                alert('입찰에 실패했습니다. 다시 시도해주세요');
                navigate('/')
            }
        } catch (error) {
            setIsLoading(false);
            // 에러 처리
            console.error(error);
            // 에러 메시지 표시
            alert('입찰 중 오류가 발생했습니다. 다시 시도해주세요');
            navigate('/')
        }
    };

    // 경매 최고 입찰금 가져오기
    const fetchCurrentHighestAmount = async() =>{
        try {
            const response = await noApi.get(`/auctionbid/auction-maximum-bid/${auctionId}`);
            setCurrentHighestBidAmount(response.data.highestBidAmount);

        } catch (error) {
            // 에러 메시지 표시
            alert('오류가 발생했습니다.');
        }
    }

    // 경매 최고 입찰금 새로고침 버튼
    const refreshCurrentHighestAmount = async() =>{
        try {
            const response = await noApi.get(`/auctionbid/auction-maximum-bid/${auctionId}`);
            setCurrentHighestBidAmount(response.data.highestBidAmount);
            if(currentHighestBidAmount === response.data.highestBidAmount){
                alert("최고 입찰가는 변함없습니다.")
            } else{
                alert("최고 입찰가가 변경되었습니다.")
            }

        } catch (error) {
            // 에러 메시지 표시
            alert('오류가 발생했습니다.');
        }
    }

    return (
        <div className="auction-bid-container">
            {isLoading && <LoadingSpinner />}

            <div className="content-container">
                {auction ? (
                    <div className="thumbnail">
                        {auction.thumbNailUrl && (
                            <img
                                className="thumb"
                                src={`https://dsi4a4vms3mme.cloudfront.net/` + `${auction.thumbNailUrl.replace('origin/', 'thumbnail/')}`}
                                alt="Thumbnail"
                            />
                        )}
                    </div>
                ) : null}

                <div className="highest-bid-container">
                    <div className="current-highest-bid-container">
                        <div className="current-highest-bid">
                            <div>현재 최고 입찰가 : </div>
                            <div className="highest-bid">{currentHighestBidAmount} 원</div>
                        </div>
                        <button className="refresh-button" onClick={refreshCurrentHighestAmount}>새로고침</button>
                    </div>
                    <div className="instruction">
                        입찰 금액을 입력하기 전에 입찰금 새로고침 버튼을 눌러서<br />
                        <span>현재 최고 입찰금을 확인해주세요.</span>
                    </div>
                </div>

                <div className="bid-input-container">
                    <input
                        type="text"
                        className="bid-input"
                        value={bidAmount}
                        onChange={handleBidAmountChange}
                        placeholder="입찰 금액을 입력하세요( 원 )"
                    />
                    <button className="bid-button" onClick={handleBidSubmit}>입찰하기</button>
                </div>
            </div>
        </div>
    );
};

export default AuctionBid;
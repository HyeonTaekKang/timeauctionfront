import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useNavigationType, useParams} from "react-router-dom";
import AuctionTimer from "../auctionTimer/AuctionTimer";
import DOMPurify from 'dompurify';
import '../../css/components/auctionDetail/AuctionDetail.css';
import RecommendAuction from "./RecommendAuction";
import {api, noApi} from "../../api/axios";
import AuctionMaximumBidList from "../auctionMaximumBidList/AuctionMaximumBidList";
import moment from "moment/moment";
import {FaSync} from "react-icons/fa";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const AuctionDetail = () => {

    const navigate = useNavigate();
    const location = useLocation();

    let accessToken = localStorage.getItem("accessToken");
    let userInfo = localStorage.getItem("userInfo"); // 로컬 스토리지에서 사용자 ID 가져오기

    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const {auctionId} = useParams();
    const [auction, setAuction] = useState(null);
    const [isParticipating, setIsParticipating] = useState(false); // 참여 상태 관리

    // 컴포넌트가 마운트될 때마다 스크롤을 최상위로 이동
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // 경매 참여 버튼 클릭 핸들러
    const handleParticipateAuction = async () => {
        if (!accessToken) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }
        if (isParticipating) return; // 이미 참여 중이면 함수 종료
        setIsParticipating(true); // 클릭 시 상태를 true로 설정
        if (auction.sellerId === JSON.parse(userInfo).id) {
            alert("본인의 경매에는 참여할 수 없습니다.")
        }
        try {
            setLoading(true);
            // 보유한 경매권이 유효한지, 경매권을 보유중인지를 확인
            const ticketValidResponse = await api.get('/auth/user/checkTicketValidity');

            // 경매가 유효한지 확인 ( 경매시간이 지났는지 확인 )
            const auctionValidResponse = await api.get(`/auction/${auctionId}/checexpired`);

            // 두 가지 조건 모두 확인 후 분기 처리
            if (ticketValidResponse.data.isValid && auctionValidResponse.data.isActive) {
                setLoading(false);
                navigate(`/auctionWaiting/${auctionId}`);
            } else {
                if (!ticketValidResponse.data.isValid) {
                    alert('기간이 만료된 경매권을 보유중');
                    setLoading(false);
                }
                if (!auctionValidResponse.data.isActive) {
                    alert('경매 시간이 지났습니다.');
                    setLoading(false);
                    // 새로고침
                    window.location.reload(); // 현재 페이지 새로고침
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                alert(`${error.response.data.message}`);
                setLoading(false);
            }
        } finally {
            setIsParticipating(false);
            setLoading(false);
        }

    };

    const fetchAuction = async () => {
        try {
            const response = await noApi.get(`/auction/${auctionId}`);
            const auction = response.data;

            console.log(auction)

            setAuction(auction)
        } catch (error) {
            console.error('Failed to fetch auction data:', error);
        }
    }

    // 경매 최고 입찰금 새로고침 버튼
    const refreshCurrentHighestAmount = async () => {
        try {
            const response = await noApi.get(`/auction/maximum-bid/${auctionId}`);

            // 이전 최고 입찰가와 비교
            const newHighestBidAmount = response.data.highestBidAmount;

            if (auction && auction.highestBidAmount === newHighestBidAmount) {
                alert("최고 입찰가는 변함없습니다.");
            } else {
                // 상태 업데이트
                setAuction(prevAuction => ({
                    ...prevAuction,
                    highestBidAmount: newHighestBidAmount
                }));
                alert("최고 입찰가가 변경되었습니다.");
            }

        } catch (error) {
            // 에러 메시지 표시
            alert('오류가 발생했습니다.');
        }
    }

    useEffect(() => {

        fetchAuction();

    }, [auctionId]);


    return (
        <>
            {loading && <LoadingSpinner />}
            {auction ? (
                <div className="auction-detail-container">
                    <div className="auction-detail-left">
                        <div className="auction-detail-thumbnail">
                            {auction.thumbNailUrl && (
                                <img
                                    className="auction-detail-thumbnail"
                                    src={`https://timeauction-auctionthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/` + `${auction.thumbNailUrl}`}
                                    alt="Thumbnail"
                                />
                            )}
                        </div>
                        <div className="auction-details-contents">
                            <span className="auction-details-contents-left">
                                <div className="auction-detail-title"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(auction.title)}}/>

                                <div className="auction-start-end-time-highestBidAmount">
                                    <div className="start-end-time-container">
                                        <div className="start-time-term">시작 시간 :<span>{moment(auction.startTime).format('YYYY-MM-DD HH:mm')}</span></div>
                                        <div className="end-time-term">종료 시간 :<span>{moment(auction.endTime).format('YYYY-MM-DD HH:mm')}</span>
                                        </div>
                                    </div>
                                    <div className="auction-highestBidAmount">
                                    <span> 최고 입찰가 : </span>
                                    <span className="amount"> {auction.highestBidAmount}원</span>
                                    <button className="refresh-currentHighestBidAmount"
                                            onClick={refreshCurrentHighestAmount}>
                                        <FaSync size="9"/>
                                    </button>
                                </div>

                                </div>
                                <div className="auction-nickname">판매자 : {auction.nickName}</div>

                                {/*<div className="auction-highestBidAmount">*/}
                                {/*    <span> 최고 입찰가 : </span>*/}
                                {/*    <span className="amount"> {auction.highestBidAmount}원</span>*/}
                                {/*</div>*/}

                            </span>

                            <div className="auction-details-contents-right">
                                <AuctionMaximumBidList/>
                            </div>
                        </div>
                        <div className="auction-detail-description">
                            <div
                                className="auction-description-content"
                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(auction.description)}}
                            />
                        </div>
                        <div className="auction-detail-bottom-container">
                            <div className="auction-timer-container">
                                <AuctionTimer startTime={auction.startTime} endTime={auction.endTime}/>
                            </div>
                            <button
                                className={`auction-participate-button ${
                                    auction && moment(auction.endTime, 'YYYY-MM-DD HH:mm:ss').valueOf() < moment().valueOf()
                                        ? 'disabled'
                                        : ''
                                }`}
                                onClick={handleParticipateAuction}
                                disabled={
                                    auction &&
                                    userInfo &&
                                    moment(auction.endTime, 'YYYY-MM-DD HH:mm:ss').valueOf() < moment().valueOf() ||
                                    (auction && userInfo && auction.sellerId === JSON.parse(userInfo).id)
                                }
                            >
                                {auction && userInfo && auction.sellerId === JSON.parse(userInfo)?.id ? "나의 경매입니다." : "경매하기"}
                            </button>
                        </div>
                        {/*<div className="auction-comments">*/}
                        {/*    <AuctionCommentContainer/>*/}
                        {/*</div>*/}
                    </div>
                    <div className="auction-detail-right">
                        <RecommendAuction/>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default AuctionDetail;
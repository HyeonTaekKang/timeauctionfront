import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";

import {useNavigate, useParams } from "react-router-dom";
import '../../css/components/auctionWaitingRoom/auctionWatingRoom.css';
import {api} from "../../api/axios";

const WaitingRoomPage = () => {
    const {auctionId} = useParams();
    let navigate = useNavigate();
    const [userRank, setUserRank] = useState(null);

    useEffect(() => {
        const initializeWaitingRoom = async () => {
            await registerWaitingRoom();
            await fetchUserRank(); // registerWaitingRoom이 완료된 후에 fetchUserRank 호출
        };

        initializeWaitingRoom();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (userRank !== null) {
                fetchUserRank();
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [userRank]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            const confirmationMessage = '대기열을 이탈하면 다시 대기해야합니다. 나가시겠습니까?';
            event.returnValue = confirmationMessage; // 이 속성에 값을 설정하면 브라우저에서 경고를 표시합니다.
            handleLeaveQueue(); // 페이지를 떠나기 전에 leave 메서드 호출
            return confirmationMessage; // 일부 브라우저에서는 이 값을 사용합니다.
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const preventGoBack = () => {
            if(window.confirm("뒤로가시면 대기열에서 삭제됩니다. 나가시겠습니까?")) {
                handleLeaveQueue();
                window.history.back();
            } else {
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", preventGoBack);

        return () => {
            window.removeEventListener("popstate", preventGoBack);
        }
    }, [])

    // 대기열에서 유저를 제거하는 함수
    const handleLeaveQueue = async () => {
        try {
            await api.delete(`/auctionqueue/leave/waitqueue?queue=auction${auctionId}`);
            console.log('Successfully left the wait queue');
        } catch (error) {
            console.error('Error leaving the wait queue:', error);
            alert("error");
            navigate('/')
        }
    };

    const registerWaitingRoom = async () => {
        try {
            const response = await api.get(`/auctionqueue/waiting-room?queue=auction${auctionId}`);console.log('Response:', response.data); // 응답 데이터 확인
            setUserRank(response.data.rank); // userRank 상태 업데이트

        } catch (error) {
            console.error('Error fetching waiting room data:', error);
            alert("error");
            navigate('/')
        }
    };

    const fetchUserRank = async () => {
        try {
            const response = await api.get(`/auctionqueue/rank?queue=auction${auctionId}`);
            const {rank} = response.data;
            console.log(response.data);
            if (rank <= 0) {
                // 다시 한번 더 확인
                const response = await api.get(`/auctionqueue/allowed?queue=auction${auctionId}`);
                if(response.data.allowed){
                    navigate(`/auctionBid/${auctionId}`);
                }
            } else{
                console.log(rank);
                setUserRank(rank);
            }
        } catch (error) {
            console.error('Error fetching user rank:', error);
            alert("error");
            navigate('/')
        }
    };

    return (
        <div className="waiting-room">
            <div className="waiting-message-container">
                <div className="waiting-message">
                    <div className="waiting-title">입장 대기 중입니다</div>
                    <span className="waiting-rank-label">현재 대기 순번 </span>
                    <span className="waiting-rank">
                    {userRank !== null ? (
                        <span>{userRank}</span>
                    ) : (
                        <div>계산중</div>
                    )}
                    </span>
                    <p className="waiting-note">잠시만 기다려주세요.</p>
                    <p className="warning">페이지 이탈, 새로고침, 뒤로가기 절대금지!!</p>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoomPage;
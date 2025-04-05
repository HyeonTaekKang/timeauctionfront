import moment from "moment";
import {useEffect, useState} from "react";
import '../../css/components/auctionTimer/AuctionTimer.css';

const AuctionTimer = ({ startTime, endTime }) => {
    const [timeRemaining, setTimeRemaining] = useState('00:00:00');
    const [timerMessage, setTimerMessage] = useState(''); // 경매 상태 메시지

    useEffect(() => {
        const startTimeMs = moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
        const endTimeMs = moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
        const currentTimeMs = moment().valueOf();

        let interval;

        const calculateRemainingTime = () => {
            const currentTimeMs = moment().valueOf();
            let remainingTimeMs;

            if (currentTimeMs < startTimeMs) {
                // 경매 시작 전
                remainingTimeMs = startTimeMs - currentTimeMs;
                setTimerMessage('경매 시작까지 남은 시간');
            } else if (currentTimeMs >= startTimeMs && currentTimeMs < endTimeMs) {
                // 경매 진행 중
                remainingTimeMs = endTimeMs - currentTimeMs;
                setTimerMessage('경매 종료까지 남은 시간');
            } else {
                // 경매 종료 후
                clearInterval(interval);
                setTimeRemaining('00:00:00');
                setTimerMessage('경매 종료');
                return;
            }

            const seconds = Math.floor(remainingTimeMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            const displaySeconds = (seconds % 60).toString().padStart(2, '0');
            const displayMinutes = (minutes % 60).toString().padStart(2, '0');
            const displayHours = hours.toString().padStart(2, '0');

            setTimeRemaining(`${displayHours}:${displayMinutes}:${displaySeconds}`);
        };

        calculateRemainingTime(); // 초기 렌더링 시에도 시간을 계산

        interval = setInterval(calculateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [startTime, endTime]);

    return (
        <div className="timer-container">
            <span className="time-text">{timerMessage} :</span>
            <span className="time-value">{timeRemaining.split(':')[0]}</span>
            <span className="time-text">시간</span>
            <span className="time-value">{timeRemaining.split(':')[1]}</span>
            <span className="time-text">분</span>
            <span className="time-value">{timeRemaining.split(':')[2]}</span>
            <span className="time-text">초</span>
        </div>
    );
};

export default AuctionTimer;
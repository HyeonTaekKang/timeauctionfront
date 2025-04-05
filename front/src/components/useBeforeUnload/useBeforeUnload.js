import { useEffect } from 'react';

const useBeforeUnload = (message, when, handleLeaveQueue) => {
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (when) {
                event.preventDefault(); // 기본 동작 방지
                event.returnValue = message; // 경고 메시지 설정
            }
        };

        const handlePopState = (event) => {
            if (when) {
                const confirmLeave = window.confirm(message);
                if (confirmLeave) {
                    handleLeaveQueue(); // 대기열에서 제거
                } else {
                    event.preventDefault(); // 페이지 이동 방지
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [message, when, handleLeaveQueue]);
};

export default useBeforeUnload;

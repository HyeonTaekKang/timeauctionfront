import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import '../../css/components/auctionComment/AuctionComment.css';
import { IoPeopleCircleSharp } from "react-icons/io5";

const AuctionComment = ({ comment }) => {
    const createdAt = new Date(comment.createdAt);
    const formattedTime = () => {
        const now = new Date();
        const diffInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((now - createdAt) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return `${Math.floor((now - createdAt) / (1000 * 60))}분 전`;
        } else if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        } else if (diffInDays < 1) {
            return format(createdAt, 'HH:mm');
        } else if (diffInDays < 14) {
            return `${diffInDays}일 전`;
        } else if (diffInDays < 30) {
            return `${Math.floor(diffInDays / 7)}주 전`;
        } else if (diffInDays < 365) {
            return `${Math.floor(diffInDays / 30)}개월 전`;
        } else {
            return `${Math.floor(diffInDays / 365)}년 전`;
        }
    };

    return (
        <div className="auction-comment">
            <div className="user-icon"><IoPeopleCircleSharp style={{ fontSize: '2rem', color: 'gray' }}/></div>
            <div className="comment-info">
                <div className="nickname-time">
                    <span className="nickname">{comment.nickName}</span>
                    <span className="time">{formattedTime()}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
            </div>
        </div>
    );
};

export default AuctionComment;
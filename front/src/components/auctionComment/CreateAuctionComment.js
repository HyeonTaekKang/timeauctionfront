import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import '../../css/components/createAuctionComment/CreateAuctionComment.css';
import {api} from "../../api/axios";
import {FaComment} from "react-icons/fa";
const CreateAuctionComment = ({onCommentSubmit}) => {
    const [commentText, setCommentText] = useState('');
    const { auctionId } = useParams();

    let accessToken = localStorage.getItem('accessToken');

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setCommentText(e.target.value);
    };

    // 댓글을 등록하는 로직
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 시 새로고침 방지

        // 사용자가 로그인하지 않았을 경우, 메시지를 표시합니다.
        if (!accessToken) {
            alert("로그인 후 이용 가능합니다.");
            return;
        }
        if (!commentText) {
            alert('댓글을 입력해주세요');
            return;
        }

        const newComment = {
            content: commentText
        };

        try {
            // 서버에 댓글 등록 요청을 보내고 새로운 댓글의 ID를 받습니다.
            const response = await api.post(`/${auctionId}/comments`, newComment);
            const newCommentId = response.data;

            // 새로운 댓글의 ID를 상위 컴포넌트에 알립니다.
            onCommentSubmit(newCommentId);
            setCommentText('');
        } catch (error) {
            console.error('Failed to submit the comment', error);
            alert('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <form className="create-auction-comment" onSubmit={handleSubmit}>
            <div className="comment-header">
                <FaComment size="17"/>
                <div htmlFor="comment-input">댓글</div>
            </div>
            <input
                className="comment-input"
                id="comment-input"
                value={commentText}
                placeholder="댓글을 입력하세요."
                onChange={handleInputChange}
            />
            <button className="submit-button" type="submit">댓글 등록</button>
        </form>
    );
};

export default CreateAuctionComment;
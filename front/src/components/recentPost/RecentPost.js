import React from 'react';
import '../../css/components/recentPost/RecentPost.css';
import { Link } from "react-router-dom";
import {FaRegComment} from "react-icons/fa";

const RecentPost = ({ recentPost }) => {

    function getDescriptionText(description) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');
        const paragraphs = doc.querySelectorAll('p');
        let descriptionText = '';

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            if (!paragraph.querySelector('img')) {
                descriptionText += paragraph.textContent.trim() + '\n';
            }
        }

        return descriptionText.trim();
    }

    function getFirstImageSrc(content) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const firstImage = doc.querySelector('img');

        return firstImage ? firstImage.src : null; // 첫 번째 이미지의 src 반환, 없으면 null 반환
    }

    const firstImageSrc = getFirstImageSrc(recentPost.content);

    function formatDate(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInMs = now - createdDate;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        } else {
            return `${diffInDays}일 전`;
        }
    }


    return (
        <div id="post-container">
            <Link to={`/post/${recentPost.id}`}>
                <div className="post">
                    <div className={`post-title-content-image ${!firstImageSrc ? 'no-image' : ''}`}>
                        <div className="post-title-content">
                            <div className="post-title" dangerouslySetInnerHTML={{ __html: recentPost.title }} />
                            <div className="post-content">{getDescriptionText(recentPost.content)}</div>
                        </div>

                        {/* 이미지를 존재할 때만 보여줌 */}
                        {firstImageSrc && <img src={firstImageSrc} alt="Post Image" className="post-image" />}
                    </div>

                    <div className="post-metadata">
                        <span className="post-user-nickName">{recentPost.nickName}</span>
                        <span className="post-comment-count"><FaRegComment />{recentPost.commentCount}</span>
                        <span className="post-createdAt">{formatDate(recentPost.createdAt)}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default RecentPost;

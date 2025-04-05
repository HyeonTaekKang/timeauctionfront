import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import "../../css/components/postDetail/PostDetail.css";
import {useSelector} from "react-redux";
import DOMPurify from "dompurify";
import PostCommentList from "../postComment/PostCommentList";
import {FaRegComment} from "react-icons/fa";
import {IoMdTime} from "react-icons/io";
import PostList from "../postList/PostList";
import RecentPostList from "../recentPost/RecentPostList";
import {AiOutlineMore} from "react-icons/ai";
import ProductOverflowMenu from "../productDetail/ProductOverflowMenu";
import PostOverflowMenu from "./PostOverflowMenu";
import {noApi, noTokenPostApi} from "../../api/axios";

const PostDetail = () => {

    let accessToken = localStorage.getItem("accessToken")
    let userInfo = localStorage.getItem("userInfo"); // 로컬 스토리지에서 사용자 ID 가져오기

    const location = useLocation();

    // 컴포넌트가 마운트될 때마다 스크롤을 최상위로 이동
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);


    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef(null);

    const fetchPost = async () => {
        try {
            const response = await noApi.get(`/post/${postId}`);
            const post = response.data;

            console.log(post)

            setPost(post)
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        }
    };

    useEffect(() => {

        fetchPost();

    }, [postId]);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

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
        <>
            {post ? (
                <div className="post-detail-container">
                    <div className="post-detail-header">
                        <div className="post-detail-title"
                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.title)}}/>

                        <div className="post-detail-metadata">
                            <div className="post-detail-block">
                                <span className="post-detail-user-nickName">{post.nickName}</span>
                                <span
                                    className="post-detail-comment-count"><FaRegComment/>{post.commentCount}</span>
                                <span className="post-detail-createdAt"><IoMdTime />{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="post-overflow-block">
                                {userInfo && post && (
                                    post.userId === JSON.parse(userInfo).id && (
                                        <div className="post-overflow-menu" onClick={toggleMenu}>
                                            <AiOutlineMore size={23}/>
                                        </div>
                                    )
                                )}

                                {isMenuOpen && (
                                    <div className="post-overflow-menu-container" ref={menuRef}>
                                        <PostOverflowMenu postId={post.id} post={post}/>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="post-detail-content">
                        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.content)}}/>
                    </div>
                    <div className="post-detail-bottom">
                        <RecentPostList/>
                        <h3>댓글{post.commentCount}개</h3>
                        <PostCommentList/>
                    </div>

                </div>
            ) : null}
        </>
    );
};

export default PostDetail;
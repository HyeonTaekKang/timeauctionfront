import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import '../../css/components/postList/PostList.css';
import {Link, useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";
import {BsChatSquareDotsFill} from "react-icons/bs";
import {BiPencil} from "react-icons/bi";
import RecentProduct from "../recentProduct/RecentProduct";
import RecentPost from "../recentPost/RecentPost";
import {noApi, noTokenPostApi} from "../../api/axios";

const PostList = () => {
        const [postList, setPostList] = useState([]);
        const navigate = useNavigate();
        const [loading, setLoading] = useState(false);
        const [hasMore, setHasMore] = useState(true);
        const loader = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(handleObserver, {
                root      : null,
                rootMargin: '20px',
                threshold : 1.0,
            });

            if (loader.current) {
                observer.observe(loader.current);
            }

            return () => observer.disconnect();
        }, [hasMore, loading]);

        const loadPosts = async () => {
            setLoading(true);
            const lastId = postList.length > 0 ? postList[postList.length - 1].id : null;
            let requestURL = '/post/recents';
            if (lastId) {
                requestURL += `?lastId=${lastId}`;
            }
            const response = await noApi.get(requestURL);
            setPostList((prevPosts) => [...prevPosts, ...response.data.data]);
            setLoading(false);
            if (response.data.data.length === 0) {
                setHasMore(false);
            }
        };

        const handleObserver = (entities) => {
            const target = entities[0];
            if (target.isIntersecting && hasMore && !loading) {
                loadPosts();
            }
        };

        const handlePostClick = () => {
            navigate('/new/post');
        };

        return (
            <>
                <div className="post-list-header">
                    <div className="post-list-header-left">
                        <BsChatSquareDotsFill size="19"></BsChatSquareDotsFill>
                        <span>커뮤니티</span>
                    </div>
                    <div className="post-list-header-right" onClick={handlePostClick}>
                        <span><BiPencil /></span>
                        <div className="post-button" >
                            글쓰기
                        </div>
                    </div>
                </div>
                <div className="post-list-container">
                    {postList.length > 0 ? (
                        postList.map((post, index) => (
                            <Link to={`/post/${post.id}`} key={index} className="post-item">
                                <div className="post-details">
                                    <div className="post-details">
                                        <RecentPost key={index} recentPost={post}/>
                                    </div>
                                </div>
                            </Link>
                        ))) : null}
                    <div ref={loader}>
                        {loading ? (
                            <div className="loading-indicator">잠시만요!</div>
                        ) : hasMore ? null : (
                            <div className="no-more-items"></div>
                        )}
                    </div>
                </div>
            </>

        );
    }
;

export default PostList;
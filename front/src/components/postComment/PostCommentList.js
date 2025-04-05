import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import "../../css/components/postCommentList/PostCommentList.css";
import {api, noApi, noTokenPostApi, postApi} from "../../api/axios";
import {AiOutlineMore} from "react-icons/ai";
import PostCommentOverflowMenu from "./PostCommentOverflowMenu";

const PostCommentList = () => {

    let accessToken = localStorage.getItem("accessToken")
    let userInfo = localStorage.getItem("userInfo"); // 로컬 스토리지에서 사용자 ID 가져오기

    const {postId} = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // 새 댓글 상태 추가
    const [replyContent, setReplyContent] = useState(""); // 대댓글 상태 추가
    const loader = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [loadedReplies, setLoadedReplies] = useState({});
    const [showButtons, setShowButtons] = useState(false);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null); // 대댓글 작성 중인 댓글 ID
    const [visibleReplies, setVisibleReplies] = useState({}); // 대댓글 표시 상태
    const [replyCounts, setReplyCounts] = useState({}); // 각 댓글의 대댓글 수 관리
    const [moreRepliesVisible, setMoreRepliesVisible] = useState({}); // "더 보기" 버튼 상태
    const [loadingReplies, setLoadingReplies] = useState(false); // 대댓글 로딩 상태 추가
    const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
    const [updateNewComment, setUpdateNewComment] = useState(""); // 수정할 댓글 내용
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null); // 메뉴 열리기 상태 추가
    const menuRef = useRef(null);

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

    useEffect(() => {
        setComments([]);
        loadComments(false); // lastID 포함 X
    }, [postId]);

    const loadComments = async (useLastId = true) => {
        setLoading(true);

        // lastId는 useLastId가 true일 때만 사용하고, postId가 변경될 때는 null로 설정
        const lastId = (useLastId && comments.length > 0) ? comments[comments.length - 1].id : null;

        let requestURL = `/post/postComment/${postId}`;
        if (lastId) {
            requestURL += `?lastId=${lastId}`; // lastId가 있는 경우에만 쿼리에 추가
        }

        try {
            const response = await noApi.get(requestURL);
            setComments((prevComments) => [...prevComments, ...response.data.data]);
            if (response.data.data.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore && !loading) {
            loadComments(); // lastId를 사용하여 댓글 로드
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // 사용자가 로그인하지 않았을 경우, 결제를 실행하지 않고 경고 메시지를 표시합니다.
        if (!accessToken) {
            alert("로그인 후 이용 가능합니다.");
        }

        try {
            await api.post(
                '/post/postComment',
                {
                    postId         : postId,
                    comment        : newComment,
                    parentCommentId: null // 최상위 댓글
                },
            );

            setShowButtons(false);
            setNewComment(""); // 입력 필드 초기화


            setComments([]); // 기존 댓글 목록 비우기

            loadComments(false); // 전체 댓글을 새로 가져오기
        } catch (error) {
            console.error('Failed to create comment:', error);
        }
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        // 사용자가 로그인하지 않았을 경우, 결제를 실행하지 않고 경고 메시지를 표시합니다.
        if (!accessToken) {
            alert("로그인 후 이용 가능합니다.");
        }

        try {
            // 대댓글 작성
            await api.post(
                '/post/postComment',
                {
                    postId         : postId,
                    comment        : replyContent,
                    parentCommentId: replyingToCommentId // 최상위 댓글 id
                },
            );

            setReplyContent(""); // 대댓글 입력 필드 초기화
            setReplyingToCommentId(null); // 대댓글 입력 종료

            // 대댓글을 작성한 후, 해당 댓글의 대댓글을 다시 불러옵니다.
            setLoadingReplies(true); // 로딩 시작
            const replies = await fetchReplies(replyingToCommentId); // 작성한 댓글의 대댓글 가져오기
            setComments(prevComments => {
                const updatedComments = [...prevComments];
                const commentIndex = updatedComments.findIndex(c => c.id === replyingToCommentId);
                if (commentIndex !== -1) {
                    updatedComments[commentIndex].replies = replies; // 새 대댓글 추가
                }
                return updatedComments;
            });
        } catch (error) {
            console.error('Failed to create reply:', error);
        } finally {
            setLoadingReplies(false); // 로딩 종료
        }
    };


    const fetchReplies = async (parentCommentId, lastId = null) => {
        try {
            const response = await noApi.get(`/post/postComment/replies/${parentCommentId}`, {
                params: {lastId, limit: 8} // lastId가 null일 경우, 첫 요청 시에는 lastId가 포함되지 않음
            });
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch replies:', error);
            throw error;
        }
    };


    const handleToggleReplies = async (commentId) => {

        if (visibleReplies[commentId]) {
            setVisibleReplies(prev => ({...prev, [commentId]: false}));
        } else {
            if (!loadedReplies[commentId]) {
                setLoadingReplies(true); // 로딩 시작
                try {
                    const replies = await fetchReplies(commentId); // 대댓글 가져오기
                    setComments(prevComments => {
                        const updatedComments = [...prevComments];
                        const commentIndex = updatedComments.findIndex(c => c.id === commentId);
                        if (commentIndex !== -1) {
                            updatedComments[commentIndex].replies = replies; // 대댓글 추가
                            replyCounts[commentId] = replies.length; // 대댓글 수 업데이트
                            setMoreRepliesVisible(prev => ({...prev, [commentId]: replies.length === 8})); // "더 보기" 상태 설정
                        }
                        return updatedComments;
                    });
                } catch (error) {
                    console.error('Failed to fetch replies:', error);
                } finally {
                    setLoadingReplies(false); // 로딩 종료
                    setLoadedReplies(prev => ({...prev, [commentId]: true}));
                }
                setVisibleReplies(prev => ({...prev, [commentId]: true}));
            } else {
                setVisibleReplies(prev => ({...prev, [commentId]: true}));
            }
        }
    };


    const loadMoreReplies = async (commentId) => {
        setLoadingReplies(true); // 로딩 시작
        const lastReplyId = comments.find(c => c.id === commentId)?.replies?.slice(-1)[0]?.id; // 마지막 대댓글 ID

        try {
            const moreReplies = await fetchReplies(commentId, lastReplyId); // lastId를 사용하여 추가 대댓글 가져오기
            setComments(prevComments => {
                const updatedComments = [...prevComments];
                const commentIndex = updatedComments.findIndex(c => c.id === commentId);
                if (commentIndex !== -1) {
                    updatedComments[commentIndex].replies = [
                        ...updatedComments[commentIndex].replies,
                        ...moreReplies
                    ];
                }
                return updatedComments;
            });
            // "더 보기" 버튼 상태 업데이트
            if (moreReplies.length < 8) {
                setMoreRepliesVisible(prev => ({...prev, [commentId]: false})); // 더 이상 대댓글이 없으면 숨김
            }
        } catch (error) {
            console.error('Failed to load more replies:', error);
        } finally {
            setLoadingReplies(false); // 로딩 종료
        }
    };

    const handleUpdateComment = async (commentId, updatedComment, isReply = false) => {
        const confirmed = window.confirm("댓글을 수정하시겠습니까?");
        if (!confirmed) return; // 사용자가 취소하면 함수 종료

        try {
            await api.put(`/post/postComment/${commentId}`, { comment: updatedComment });

            if (isReply) {
                // 대댓글 업데이트
                setComments(prevComments =>
                    prevComments.map(comment => {
                        if (comment.replies) {
                            const replyIndex = comment.replies.findIndex(reply => reply.id === commentId);
                            if (replyIndex !== -1) {
                                // 대댓글을 수정
                                const updatedReplies = [...comment.replies];
                                updatedReplies[replyIndex] = { ...updatedReplies[replyIndex], comment: updatedComment };
                                return { ...comment, replies: updatedReplies };
                            }
                        }
                        return comment;
                    })
                );
            } else {
                // 일반 댓글 업데이트
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === commentId ? { ...comment, comment: updatedComment } : comment
                    )
                );
            }

            setEditingCommentId(null);
            setUpdateNewComment(""); // 수정 입력 필드 초기화
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };


    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
        if (!confirmed) return; // 사용자가 취소하면 함수 종료

        try {
            await api.delete(`/post/postComment/${commentId}`);
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleDeleteReplyComment = async (replyId, parentCommentId) => {
        const confirmed = window.confirm("대댓글을 삭제하시겠습니까?");
        if (!confirmed) return; // 사용자가 취소하면 함수 종료

        try {
            await api.delete(`/post/postComment/reply/${replyId}`);

            // 대댓글을 삭제한 후, 해당 대댓글을 포함하는 댓글의 상태 업데이트
            setComments(prevComments =>
                prevComments.map(comment => {
                    if (comment.id === parentCommentId) {
                        return {
                            ...comment,
                            replies: comment.replies.filter(reply => reply.id !== replyId) // 삭제된 대댓글 제외
                        };
                    }
                    return comment;
                })
            );
        } catch (error) {
            console.error('Failed to delete reply comment:', error);
        }
    };


    const toggleMenu = (commentId) => {
        setMenuOpenId(prevId => (prevId === commentId ? null : commentId)); // 클릭한 댓글 ID로 메뉴 열기/닫기
    };

    function formatDate(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const diffInMs = now - createdDate;

        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) {
            if (diffInMinutes < 1) {
                return `${diffInSeconds}초 전`;
            }
            return `${diffInMinutes}분 전`;
        } else if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        } else {
            return `${diffInDays}일 전`;
        }
    }

    return (
        <div className="post-comment-container">
            <div className="comment-input-container">
                <input
                    type="text"
                    value={newComment}
                    onFocus={() => setShowButtons(true)}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 추가하세요..."
                    className="comment-input"
                />
                {showButtons && (
                    <div className="comment-buttons">
                        <button
                            className="cancel-button"
                            onClick={() => {
                                setNewComment("");
                                setShowButtons(false);
                            }}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            onClick={handleCommentSubmit}
                            className={newComment.trim() ? "submit-button active" : "submit-button"}
                            disabled={!newComment.trim()}
                        >
                            댓글
                        </button>
                    </div>
                )}
            </div>
            <div className="post-comment-list">
                {comments.map(comment => (
                    <div className="post-comment" key={comment.id}>
                        <div className="post-comment-header">
                            <div className="post-comment-metadata">
                                <div className="post-comment-nickname">{comment.nickname}</div>
                                <div className="post-comment-created-at">{formatDate(comment.createdAt)}</div>
                            </div>
                            <div className="post-comment-overflow-block">
                                {userInfo && comment.userId === userInfo.id && (
                                    <div className="post-comment-overflow-menu" onClick={() => toggleMenu(comment.id)}>
                                        <AiOutlineMore size={23}/>
                                    </div>
                                )}
                                {menuOpenId === comment.id && (
                                    <div className="post-comment-overflow-menu-container" ref={menuRef}>
                                        <PostCommentOverflowMenu
                                            postCommentId={comment.id}
                                            onUpdate={() => {
                                                setEditingCommentId(comment.id);
                                                setUpdateNewComment(comment.comment);
                                                setMenuOpenId(null);
                                            }}
                                            onDelete={handleDeleteComment}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="post-comment-content">
                            {editingCommentId === comment.id ? (
                                <div className="edit-comment-container">
                                    <input
                                        type="text"
                                        value={updateNewComment}
                                        onChange={(e) => setUpdateNewComment(e.target.value)}
                                        placeholder="댓글을 수정하세요..."
                                        className="edit-comment-input"
                                    />
                                    <button className={updateNewComment.trim() ? "submit-button active" : "submit-button"}
                                            disabled={!updateNewComment.trim()}
                                            onClick={() => handleUpdateComment(comment.id , updateNewComment)}>수정하기
                                    </button>
                                    <button
                                        className="cancel-button"
                                        onClick={() => {
                                        setEditingCommentId(null);
                                        setNewComment("");
                                    }}>취소
                                    </button>
                                </div>
                            ) : (
                                <span>{comment.comment}</span>
                            )}
                        </div>

                        <div className="reply-button" onClick={() => setReplyingToCommentId(comment.id)}>
                            답글
                        </div>

                        {comment.replyCount > 0 && (
                            <div
                                className="post-comment-reply-toggle"
                                onClick={() => handleToggleReplies(comment.id)}
                            >
                                답글 {comment.replyCount}개
                            </div>
                        )}

                        {replyingToCommentId === comment.id && (
                            <div className="comment-input-container">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="대댓글을 추가하세요..."
                                    className="comment-input"
                                />
                                <button
                                    type="submit"
                                    onClick={handleReplySubmit}
                                    className={replyContent.trim() ? "submit-button active" : "submit-button"}
                                    disabled={!replyContent.trim()}
                                >
                                    답글
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => {
                                        setReplyContent("");
                                        setReplyingToCommentId(null);
                                    }}
                                >
                                    취소
                                </button>
                            </div>
                        )}

                        {visibleReplies[comment.id] && (
                            <div className="post-comment-replies" style={{paddingLeft: '20px'}}>
                                {loadingReplies && replyingToCommentId === comment.id ? ( // 로딩 상태 체크
                                    <div className="loading-indicator">로딩 중...</div>
                                ) : (
                                    <>
                                        {comment.replies && comment.replies.map(reply => (
                                            <div className="post-comment-reply" key={reply.id}>
                                                <div className="post-comment-header">
                                                    <div className="post-comment-metadata">
                                                        <div className="post-comment-nickname">{reply.nickname}</div>
                                                        <div className="post-comment-created-at">{formatDate(reply.createdAt)}</div>
                                                    </div>
                                                    <div className="post-comment-overflow-block">
                                                        {userInfo && reply.userId === userInfo.id && (
                                                            <div className="post-comment-overflow-menu" onClick={() => toggleMenu(reply.id)}>
                                                                <AiOutlineMore size={23}/>
                                                            </div>
                                                        )}
                                                        {menuOpenId === reply.id && (
                                                            <div className="post-comment-overflow-menu-container" ref={menuRef}>
                                                                <PostCommentOverflowMenu
                                                                    postCommentId={reply.id}
                                                                    onUpdate={() => {
                                                                        setEditingCommentId(reply.id);
                                                                        setUpdateNewComment(reply.comment);
                                                                        setMenuOpenId(null);
                                                                    }}
                                                                    onDelete={() => handleDeleteReplyComment(reply.id, comment.id)} // 대댓글 삭제 시 부모 댓글 ID도 전달
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="post-comment-content">
                                                    {editingCommentId === reply.id ? (
                                                        <div className="edit-comment-container">
                                                            <input
                                                                type="text"
                                                                value={updateNewComment}
                                                                onChange={(e) => setUpdateNewComment(e.target.value)}
                                                                placeholder="댓글을 수정하세요..."
                                                                className="edit-comment-input"
                                                            />
                                                            <button
                                                                className={updateNewComment.trim() ? "submit-button active" : "submit-button"}
                                                                disabled={!updateNewComment.trim()}
                                                                onClick={() => handleUpdateComment(reply.id, updateNewComment, true)} // 대댓글 수정 시 true 전달
                                                            >
                                                                수정하기
                                                            </button>
                                                            <button
                                                                className="cancel-button"
                                                                onClick={() => {
                                                                    setEditingCommentId(null);
                                                                    setNewComment("");
                                                                }}>취소
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span>{reply.comment}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {moreRepliesVisible[comment.id] && (
                                            <div className="load-more-replies"
                                                 onClick={() => loadMoreReplies(comment.id)}>
                                                더 보기
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div ref={loader} className="loader">
                {loading ? (
                    <div className="loading-indicator">로딩 중....</div>
                ) : hasMore ? null : (
                    <div className="no-more-items"></div>
                )}
            </div>
        </div>
    );
};

export default PostCommentList;

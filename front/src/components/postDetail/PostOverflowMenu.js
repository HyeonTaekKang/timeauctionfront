import React from 'react';
import {GoPencil} from 'react-icons/go';
import "../../../src/css/components/postDetail/PostOverflowMenu.css";
import {api, postApi} from "../../api/axios";
import {useNavigate} from "react-router-dom";
import {RiDeleteBinLine} from "react-icons/ri";

const PostOverflowMenu = ({postId, post}) => {

    const navigate = useNavigate();

    const navigateEditForm = () => {
        navigate("/post/edit", {state: {post}});
    };

    const handleDeletePost = async () => {
        const confirmDelete = window.confirm("포스트를 삭제하시겠습니까?");
        if (confirmDelete) {
            // API 호출
            await api.delete(`/post/${postId}`, {})
                .then(response => {
                    alert("삭제가 완료되었습니다.");
                    navigate('/');
                })
                .catch(error => {
                    console.error("Error:", error.response.data.message);
                    alert(error.response.data.message);
                });
        }
    };

    return (
        <>
            <div className="post-update-btn" onClick={navigateEditForm}>
                <span>수정하기</span>
                <GoPencil/>
            </div>
            <div className="post-delete-btn" onClick={handleDeletePost}>
                <span>삭제</span>
                <RiDeleteBinLine/>
            </div>
        </>
    );
};

export default PostOverflowMenu;

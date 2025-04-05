import React from 'react';
import { MdOutlineSell } from 'react-icons/md';
import { GoPencil } from 'react-icons/go';
import "../../../src/css/components/postCommentList/PostCommentOverflowMenu.css";

const PostCommentOverflowMenu = ({ postCommentId, onUpdate, onDelete }) => {
    return (
        <>
            <div className="post-comment-update-btn" onClick={onUpdate}>
                <span>수정하기</span>
                <GoPencil />
            </div>
            <div className="post-comment-delete-btn" onClick={() => onDelete(postCommentId)}>
                <span>삭제하기</span>
                <MdOutlineSell />
            </div>
        </>
    );
};

export default PostCommentOverflowMenu;

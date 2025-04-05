import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {api, postApi} from "../../api/axios";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import ReactQuill from "react-quill";
import '../../css/components/editPostForm/EditPostForm.css';


const EditPostForm = () => {
    const location = useLocation();
    const { post } = location.state; // 전달된 상품 정보 받기
    const [isLoading, setIsLoading] = useState(false);
    const [postTitle, setpostTitle] = useState(''); // 글 제목
    const [postContent, setpostContent] = useState(''); // 글 설명
    const quillRef = useRef(null);
    const navigate = useNavigate();

    // 컴포넌트가 마운트 될 때 상품 정보를 초기화
    useEffect(() => {
        if (post) {
            setpostTitle(post.title); // 상품 제목 초기화
            setpostContent(post.content); // 상품 설명 초기화
        }
    }, [post]);

    const handleTitleChange = (value) => setpostTitle(value);
    const handleContentChange = (value) => setpostContent(value);

    const updatePost = async () => {
        setIsLoading(true);

        try {
            const postEdit = {
                title: postTitle,
                content: postContent,
            };

            await api.put(`/post/${post.id}`, postEdit); // JSON 데이터 전송

            setIsLoading(false);

            alert('글이 성공적으로 수정되었습니다.');
            navigate('/');
        } catch (error) {
            alert('수정도중 오류가 생겼습니다. 다시 시도해주세요');
            navigate('/');
        }
    };

    return (
        <div className="edit-post-form-container">
            {isLoading && <LoadingSpinner />}
            <div className="edit-post-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <ReactQuill
                        value={postTitle}
                        onChange={handleTitleChange}
                        modules={{ toolbar: false }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">글쓰기</label>
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={postContent}
                        onChange={handleContentChange}
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline', 'strike'],
                                ['blockquote', 'code-block'],
                                [{ header: 1 }, { header: 2 }],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ size: ['small', 'normal', 'large', 'huge'] }],
                                ['link', 'image'],
                            ],
                        }}
                        placeholder="글을 적어주세요"
                        className="quill-editor"
                    />
                </div>

                <div className="form-group">
                    <button
                        className="post-edit-button"
                        onClick={updatePost}
                    >
                        글 수정
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPostForm;
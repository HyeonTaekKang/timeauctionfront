import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {api, postApi} from "../../api/axios";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import ReactQuill from "react-quill";
import '../../css/components/createPostForm/CreatePostForm.css';

const CreatePostForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const quillRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (title.trim() !== '' || content.trim() !== '') {
                event.preventDefault();
                event.returnValue = '작성한 모든 내용은 저장되지 않습니다';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [title, content]);


    const handleTitleChange = (value) => {
        setTitle(value);
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const createPost= async () => {
        // 사용자에게 경매 생성 확인
        const isConfirmed = window.confirm("글을 작성하시겠습니까?");

        if (!isConfirmed) {
            // 사용자가 취소를 선택한 경우 함수 종료
            return;
        }

        setIsLoading(true);

        try {
            const postCreate = {
                title: title,
                content: content,
            };

            await api.post('/post', postCreate); // JSON 데이터 전송

            console.log('product created successfully');
            // 글 생성 완료
            setIsLoading(false);
            alert('글 생성 완료');
            navigate('/')
        } catch (error) {
            setIsLoading(false);
            alert('생성 실패');
            navigate('/')
        }
    };

    return (
        <>
            <div className="post-form-container">
                {isLoading && <LoadingSpinner/>}
                <div className="post-form">
                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <ReactQuill
                            value={title}
                            onChange={handleTitleChange}
                            modules={{
                                toolbar: false, // 툴바 비활성화
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">글쓰기</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={content}
                            onChange={handleContentChange}
                            modules={{
                                toolbar  : [
                                    ['bold', 'italic', 'underline', 'strike'],
                                    ['blockquote', 'code-block'],
                                    [{header: 1}, {header: 2}],
                                    [{list: 'ordered'}, {list: 'bullet'}],
                                    [{size: ['small', 'normal', 'large', 'huge']}],
                                    ['link', 'image'],
                                ],
                                clipboard: {
                                    matchVisual: false,
                                },
                            }}
                            formats={[
                                'header',
                                'font',
                                'size',
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'blockquote',
                                'list',
                                'bullet',
                                'indent',
                                'image',
                            ]}
                            placeholder="글을 작성해주세요"
                            className="quill-editor"
                            dangerouslySetInnerHTML={{__html: content}}
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="auction-create-button"
                            onClick={() => {
                                if (!title.trim()) {
                                    alert('제목을 입력해주세요.');
                                    return;
                                }
                                if (!content.trim()) {
                                    alert('설명을 입력해주세요.');
                                    return;
                                }
                                createPost();
                            }}
                        >
                            게시글 등록
                        </button>
                    </div>
                </div>
            </div>

        </>
    );

};

export default CreatePostForm;
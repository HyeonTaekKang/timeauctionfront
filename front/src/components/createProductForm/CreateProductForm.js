import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {api, apii, productApi} from "../../api/axios";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import ReactQuill from "react-quill";
import '../../css/components/createProductForm/CreateProductForm.css';

const CreateProductForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [price, setPrice] = useState('');
    const quillRef = useRef(null);

    const navigate = useNavigate();
    const handleTitleChange = (value) => {
        setTitle(value);
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    const handlePriceChange = (event) => {
        const value = event.target.value;
        if (isNaN(value) || value < 1) {
            setPrice('');
        } else {
            setPrice(value);
        }
    };

    const handleThumbnailChange = (e) => {
        if (thumbnail) {
            // 이미 썸네일이 등록되어 있는 경우, 파일 선택 창을 열지 않음
            e.preventDefault();
            return;
        }
        const file = e.target.files[0];
        const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
        if (validExtensions.includes(file.type)) {
            setThumbnail(file);
        } else {
            alert('JPG, PNG, JPEG 형식의 파일만 업로드할 수 있습니다.');
        }
    };

    const createProduct = async () => {
        // 사용자에게 경매 생성 확인
        const isConfirmed = window.confirm("시간을 판매하시겠습니까?");

        if (!isConfirmed) {
            // 사용자가 취소를 선택한 경우 함수 종료
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            const productCreate =
                {
                    title        : title,
                    description  : description,
                    price : price
                };
            const productCreateString = JSON.stringify(productCreate);
            await formData.append('productCreate', new Blob([productCreateString], {type: 'application/json'}));
            await formData.append('productThumbnail', thumbnail);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            await api.post('/product', formData, config);
            console.log('product created successfully');
            // 상품 생성 완료
            setIsLoading(false);
            alert('상품이 성공적으로 생성되었습니다.');
            navigate('/')
        } catch (error) {
            setIsLoading(false);
            alert('생성 실패:');
            navigate('/')
        }
    };

    return (
        <>
            <div className="product-form-container">
                {isLoading && <LoadingSpinner/>}
                <div className="product-form">
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
                        <label htmlFor="thumbnail" className="form-label">썸네일</label>
                        <div className="thumbnail-preview" onClick={() => {
                            if (!thumbnail) {
                                // 썸네일이 등록되어 있지 않은 경우에만 파일 선택 창을 엶
                                document.getElementById('thumbnail').click();
                            }
                        }}>
                            {thumbnail ? (
                                <div className="thumbnail-container">
                                    <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail"
                                         className="thumbnail-img"/>
                                    <button className="remove-thumbnail" onClick={(e) => {
                                        e.stopPropagation();
                                        setThumbnail(null);
                                    }}>
                                        <i className="material-icons"></i>
                                    </button>
                                </div>
                            ) : (
                                <div className="upload-label">
                                    <span className="upload-text">이곳을 클릭하여</span>
                                    <br/>
                                    <span className="upload-text">썸네일을 등록하세요</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="thumbnail"
                                className="form-control"
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleThumbnailChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">설명</label>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={description}
                            onChange={handleDescriptionChange}
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
                            placeholder="상품에 대한 설명을 적어주세요"
                            className="quill-editor"
                            dangerouslySetInnerHTML={{__html: description}}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="product-price">가격</label>
                        <input
                            className="product-price-input"
                            type="number"
                            value={price}
                            onChange={handlePriceChange}
                            placeholder="시간당 가격을 설정해주세요"
                        />
                        ( 시간 당 받으실 가격을 작성해주세요 )
                    </div>
                    <div className="form-group">
                        <button
                            className="auction-create-button"
                            onClick={() => {
                                if (!title.trim()) {
                                    alert('제목을 입력해주세요.');
                                    return;
                                }
                                if (!description.trim()) {
                                    alert('설명을 입력해주세요.');
                                    return;
                                }
                                if (isNaN(price) || price <= 0) {
                                    alert('시작 가격을 올바르게 입력해주세요.');
                                    return;
                                }
                                if (price < 1) {
                                    alert('시작 가격을 1 이상으로 설정해주세요.');
                                    return;
                                }
                                createProduct();
                            }}
                        >
                            상품 등록
                        </button>
                    </div>
                </div>
            </div>

        </>
    );

};

export default CreateProductForm;
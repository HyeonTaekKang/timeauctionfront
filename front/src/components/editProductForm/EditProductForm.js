import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {api, productApi} from "../../api/axios";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import ReactQuill from "react-quill";
import '../../css/components/editProductForm/EditProductForm.css';

const EditProductForm = () => {
    const location = useLocation();
    const { product } = location.state; // 전달된 상품 정보 받기
    const [isLoading, setIsLoading] = useState(false);
    const [productTitle, setProductTitle] = useState(''); // 상품 제목
    const [productDescription, setProductDescription] = useState(''); // 상품 설명
    const [thumbnail, setThumbnail] = useState(null); // 썸네일
    const [productPrice, setProductPrice] = useState(''); // 상품 가격
    const quillRef = useRef(null);
    const navigate = useNavigate();

    // 컴포넌트가 마운트 될 때 상품 정보를 초기화
    useEffect(() => {
        if (product) {
            setProductTitle(product.productTitle); // 상품 제목 초기화
            setProductDescription(product.productDescription); // 상품 설명 초기화
            setProductPrice(product.productPrice); // 상품 가격 초기화
            if (product.thumbNailUrl) {
                setThumbnail(product.thumbNailUrl); // 기존 썸네일 URL 초기화
            }
        }
    }, [product]);

    const handleTitleChange = (value) => setProductTitle(value);
    const handleDescriptionChange = (value) => setProductDescription(value);

    const handlePriceChange = (event) => {
        const value = event.target.value;
        if (isNaN(value) || value < 1) {
            setProductPrice('');
        } else {
            setProductPrice(value);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
        if (validExtensions.includes(file.type)) {
            setThumbnail(file); // 파일 선택 시 썸네일 상태 업데이트
        } else {
            alert('JPG, PNG, JPEG 형식의 파일만 업로드할 수 있습니다.');
        }
    };

    const updateProduct = async () => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            const productEdit = {
                title : productTitle, // 상품 제목
                description : productDescription, // 상품 설명
                price : productPrice // 상품 가격
            };
            const productEditString = JSON.stringify(productEdit);
            await formData.append('productEdit', new Blob([productEditString], { type: 'application/json' }));
            if (thumbnail && typeof thumbnail !== 'string') { // 썸네일이 파일인 경우에만 추가
                await formData.append('productThumbnail', thumbnail);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            await api.put(`/product/${product.id}`, formData, config);
            setIsLoading(false);
            alert('상품이 성공적으로 수정되었습니다.');
            navigate('/');
        } catch (error) {
            alert('수정도중 오류가 생겼습니다. 다시 시도해주세요');
            navigate('/');
        }
    };

    return (
        <div className="edit-product-form-container">
            {isLoading && <LoadingSpinner />}
            <div className="edit-product-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <ReactQuill
                        value={productTitle}
                        onChange={handleTitleChange}
                        modules={{ toolbar: false }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="thumbnail" className="form-label">썸네일</label>
                    <div className="thumbnail-preview" onClick={() => {
                        if (!thumbnail || typeof thumbnail === 'string') {
                            document.getElementById('thumbnail').click();
                        }
                    }}>
                        {thumbnail && typeof thumbnail !== 'string' ? (
                            <div className="thumbnail-container">
                                <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail" className="thumbnail-img" />
                                <button className="remove-thumbnail" onClick={(e) => {
                                    e.stopPropagation();
                                    setThumbnail(null);
                                }}>
                                    <i className="material-icons"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="upload-label">
                                {product.thumbNailUrl ? (
                                    <img src={`https://timeauction-productthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/${product.thumbNailUrl}`} alt="Existing Thumbnail" className="thumbnail-img" />
                                ) : (
                                    <span className="upload-text">이곳을 클릭하여 썸네일을 등록하세요</span>
                                )}
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
                        value={productDescription}
                        onChange={handleDescriptionChange}
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
                        placeholder="상품에 대한 설명을 적어주세요"
                        className="quill-editor"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="product-price">가격</label>
                    <input
                        className="edit-product-price-input"
                        type="number"
                        value={productPrice}
                        onChange={handlePriceChange}
                        placeholder="가격을 설정해주세요"
                    />
                    <span>( 시간 당 받으실 가격을 작성해주세요 )</span>
                </div>

                <div className="form-group">
                    <button
                        className="product-edit-button"
                        onClick={updateProduct}
                    >
                        상품 수정
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProductForm;

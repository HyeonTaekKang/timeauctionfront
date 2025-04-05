import React, {useRef, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../css/components/createAuctionForm/CreateAuctionForm.css';
import {api, apii, auctionApi} from "../../api/axios";
import {useNavigate} from "react-router-dom";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const CreateAuctionForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [auctionDuration, setAuctionDuration] = useState(0);
    const [startingPrice, setStartingPrice] = useState('');
    const quillRef = useRef(null);

    const navigate = useNavigate();
    const handleTitleChange = (value) => {
        setTitle(value);
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);
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

    const handleAuctionDurationChange = (e) => {
        setAuctionDuration(parseInt(e.target.value));
    };

    const handleStartingPriceChange = (event) => {
        const value = event.target.value;
        if (isNaN(value) || value < 1) {
            setStartingPrice('');
        } else {
            setStartingPrice(value);
        }
    };

    const createAuction = async () => {
        // 사용자에게 경매 생성 확인
        const isConfirmed = window.confirm("경매를 생성하시겠습니까? ( 경매는 한번 생성 후 변경, 삭제 할 수 없습니다.");

        if (!isConfirmed) {
            // 사용자가 취소를 선택한 경우 함수 종료
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            const auctionCreate = {
                title: title,
                description: description,
                duration: auctionDuration,
                startingPrice: startingPrice
            };
            const auctionCreateString = JSON.stringify(auctionCreate);
            formData.append('auctionCreate', new Blob([auctionCreateString], { type: 'application/json' }));
            formData.append('auctionThumbnail', thumbnail);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            await api.post('/auction', formData, config);
            console.log('Auction created successfully');
            // 경매 생성 완료
            alert('경매가 성공적으로 생성되었습니다.');
            navigate('/')
        } catch (error) {
            console.error(error); // 에러 로그 추가
            alert('경매 생성 실패:');
            navigate('/')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="auction-form-container">
                {isLoading && <LoadingSpinner/>}
                <div className="auction-form">
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
                            placeholder="경매에 대한 설명을 적어주세요"
                            className="quill-editor"
                            dangerouslySetInnerHTML={{__html: description}}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="auction-duration">경매 시간</label>
                        <select
                            id="auction-duration"
                            className="select-control"
                            value={auctionDuration}
                            onChange={(e) => {
                                const duration = parseInt(e.target.value);
                                if (isNaN(duration) || duration <= 0) {
                                    alert('경매 시간을 선택해주세요!');
                                } else {
                                    handleAuctionDurationChange(e);
                                }
                            }}
                        >
                            <option value="">경매 시간을 선택해주세요!</option>
                            <option value={1}>1일</option>
                            <option value={3}>3일</option>
                            <option value={6}>6일</option>
                            <option value={9}>9일</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="startingPrice">시작 가격</label>
                        <input
                            className="starting-price-input"
                            type="number"
                            value={startingPrice}
                            onChange={handleStartingPriceChange}
                            placeholder="경매 시작 가격을 설정해주세요"
                        />
                        <div>경매 시작 가격은 경매 생성 후 다시는 변경할 수 없습니다.</div>
                    </div>
                    <div className="form-group">
                        <button
                            className="auction-create-button"
                            onClick={() => {
                                if (!title.trim()) {
                                    alert('제목을 입력해주세요.');
                                    return;
                                }
                                if (!thumbnail) {
                                    alert('썸네일을 등록해주세요.');
                                    return;
                                }
                                if (!description.trim()) {
                                    alert('설명을 입력해주세요.');
                                    return;
                                }
                                if (!auctionDuration) {
                                    alert('경매 시간을 선택해주세요.');
                                    return;
                                }
                                if (isNaN(startingPrice) || startingPrice <= 0) {
                                    alert('시작 가격을 올바르게 입력해주세요.');
                                    return;
                                }
                                if (startingPrice < 1) {
                                    alert('시작 가격을 1 이상으로 설정해주세요.');
                                    return;
                                }
                                createAuction();
                            }}
                        >
                            경매 등록
                        </button>
                    </div>

                </div>
            </div>

        </>
    );

};

export default CreateAuctionForm;
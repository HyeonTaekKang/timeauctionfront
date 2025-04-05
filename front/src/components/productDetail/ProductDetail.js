import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import "../../css/components/productDetail/ProductDetail.css";
import NewChat from "../chat/chat/NewChat";
import ExistChat from "../chat/chat/ExistChat";
import {api, chatApi, noApi, noTokenProductApi, productApi} from "../../api/axios";
import DOMPurify from "dompurify";
import moment from "moment";
import RecommendProduct from "./RecommendProduct";
import {AiOutlineMore} from "react-icons/ai";
import ProductOverflowMenu from "./ProductOverflowMenu"; // Import DOMPurify library

const ProductDetail = () => {

    let accessToken = localStorage.getItem("accessToken")
    let userInfo = localStorage.getItem("userInfo"); // 로컬 스토리지에서 사용자 ID 가져오기

    const location = useLocation();

    const {productId} = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRoomId, setChatRoomId] = useState(null);
    const [product, setProduct] = useState(null);
    const [showNewChat, setShowNewChat] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const chatRef = useRef(null);
    const menuRef = useRef(null);

    // 컴포넌트가 마운트될 때마다 스크롤을 최상위로 이동
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        if (!isChatOpen) return;  // If the chat window is not open, do nothing.

        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setIsChatOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isChatOpen]);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleChat = () => {
        setIsChatOpen(prevState => !prevState);
    };

    // 상품 구매 로직 : 채팅창 띄워주기 , 이미 채팅이 존재하면 채팅 보여주기
    const handleBuyProduct = async () => {
        try {
            // 사용자가 로그인하지 않았을 경우, 결제를 실행하지 않고 경고 메시지를 표시합니다.
            if (!accessToken) {
                alert("로그인 후 이용 가능합니다.");
            }
            if (isChatOpen) return;

            if (product.sellerId === JSON.parse(userInfo).id) {
                alert("본인의 시간판매일 경우 채팅을 할 수 없습니다.")
            }

            if(product.productSaleStatus==='SOLD'){
                alert("이미 판매된 시간입니다.")
            }

            // 서버에 요청을 보내서 , 해당 상품에 대해 상품 판매자와 나(구매자) 간의 채팅방이 존재하는지 확인
            const parsedProductId = parseInt(productId);
            const response = await chatApi.get(`/products/${parsedProductId}/chatroom/existence`);

            // 채팅방이 존재하지 않는다면 일단 채팅을 보여주고,
            if (response.data === "noChatRoom") {
                setShowNewChat(true);
                setIsChatOpen(prevState => !prevState);
                // 채팅방이 존재한다면 채팅방 보여주기
            } else {
                setShowChat(true);
                setChatRoomId(response.data);
                setIsChatOpen(prevState => !prevState);
            }
        } catch (error) {
            console.error('Failed to check the existence of the chat room:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await noApi.get(`/product/${productId}`);
            const product = response.data;

            console.log(product)

            setProduct(product)
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        }
    };

    useEffect(() => {

        fetchProduct();

    }, [productId]);


    return (
        <>
            {product ? (
                <div className="product-detail-container">
                    <div className="product-detail-left">
                        <div className="product-detail-thumbnail">
                            {product.thumbNailUrl && (
                                <img
                                    className="product-detail-thumbnail"
                                    src={`https://timeauction-productthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/${product.thumbNailUrl}`}
                                    alt="Thumbnail"
                                />
                            )}
                            {product.productSaleStatus==='SOLD' && (
                                <div className="sold-overlay">
                                    <span>시간판매 완료</span>
                                </div>
                            )}
                        </div>

                        <div className="product-details-contents">
                            <span className="product-details-contents-left">
                                <div className="product-detail-title"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.productTitle)}}/>

                                <div className="product-detail-nickname">판매자 : {product.sellerNickName}</div>
                                <div
                                    className="product-detail-createdAt">생성일자 : {moment(product.createdAt).format('YYYY-MM-DD HH:mm')}</div>
                                <div className="product-amount-and-productoverflow-menu">
                                    <span className="amount"> 시간당 : {product.productPrice}원</span>
                                    {userInfo && product && (
                                        product.sellerId === JSON.parse(userInfo).id && (
                                            <div className="product-overflow-menu" onClick={toggleMenu}>
                                                <AiOutlineMore size={23}/>
                                            </div>
                                        )
                                    )}

                                    {isMenuOpen && (
                                        <div className="product-overflow-menu-container" ref={menuRef}>
                                            <ProductOverflowMenu productId={product.id} product={product}/>
                                        </div>
                                    )}
                                </div>
                                {/*<div className="auction-highestBidAmount">*/}
                                {/*    <span> 최고 입찰가 : </span>*/}
                                {/*    <span className="amount"> {auction.highestBidAmount}원</span>*/}
                                {/*</div>*/}

                            </span>
                        </div>
                        <div className="product-detail-description">
                            <div
                                className="product-description-content"
                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.productDescription)}}
                            />
                        </div>
                        <div className="product-detail-bottom-container">

                            <button
                                className={`product-chat-button ${ product.productSaleStatus==="SOLD" || userInfo && product.sellerId === JSON.parse(userInfo).id ? 'disabled' : ''}`}
                                onClick={handleBuyProduct}
                                disabled={product.productSaleStatus==="SOLD" || userInfo && product.sellerId === JSON.parse(userInfo).id} // 판매자일 경우 비활성화
                            >
                                {userInfo && product.sellerId === JSON.parse(userInfo).id ? "나의 상품입니다." : "채팅으로 거래하기"}
                            </button>

                            {isChatOpen && showNewChat &&
                                <NewChat ref={chatRef} onClose={() => setIsChatOpen(false)} product={product}/>}
                            {isChatOpen && showChat && chatRoomId &&
                                <ExistChat ref={chatRef} onClose={() => setIsChatOpen(false)} chatRoomId={chatRoomId}
                                           product={product}/>}
                        </div>
                        <div className="product-comments">
                            {/*<ProductCommentContainer/>*/}
                        </div>
                    </div>
                    <div className="product-detail-right">
                        <RecommendProduct/>
                    </div>
                </div>

            ) : null}

        </>
    );
};

export default ProductDetail;
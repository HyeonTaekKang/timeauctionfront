import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {api, auctionApi, productApi} from "../../api/axios";
import {BsChatLeftText} from "react-icons/bs";
import {IoClose} from "react-icons/io5";
import ProductChatRoom from "../chat/chatRoom/ProductChatRoom";
import AuctionChatRoom from "../chat/chatRoom/AuctionChatRoom";
import {MdOutlineAssignmentLate} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import RecentProduct from "../recentProduct/RecentProduct";
import RecentAuction from "../recentAuction/RecentAuction";
import "../../../src/css/components/mySell/MySellList.css";
import axios from "axios";

const MySellList = () => {

    const [sellType, setSellType] = useState('auction'); // 기본값을 'auction'으로 설정

    const [productSellList, setProductSellList] = useState([]);
    const [auctionSellList, setAuctionSellList] = useState([]);
    const [loading, setLoading] = useState(false); // 로딩 상태 변수
    const loader = useRef(null);

    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();

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

    // 내 auction list 가져오기
    const fetchAuctionSellList = async () => {
        setLoading(true);
        try {
            const lastId = auctionSellList.length > 0 ? auctionSellList[auctionSellList.length - 1].id : null;
            let requestURL = '/auction/my-auctions';
            if (lastId) {
                requestURL += `?lastId=${lastId}`;
            }
            const response = await api.get(requestURL);
            setAuctionSellList((prevMyAuctionSells) => [...prevMyAuctionSells, ...response.data.data]);
            setLoading(false);
            if (response.data.data.length === 0) {
                setHasMore(false);
            }

        } catch (error) {
            console.error('Failed to fetch myAuction:', error);
            alert("내 판매를 가져오는데 실패")
            navigate("/");

        }
    };

    // 내 product list 가져오기
    const fetchProductSellList = async () => {
        setLoading(true);
        try {
            const lastId = productSellList.length > 0 ? productSellList[productSellList.length - 1].id : null;
            let requestURL = '/product/my-products';
            if (lastId) {
                requestURL += `?lastId=${lastId}`;
            }
            const response = await api.get(requestURL);
            setProductSellList((prevMyProductSells) => [...prevMyProductSells, ...response.data.data]);
            setLoading(false);
            if (response.data.data.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to fetch myProduct:', error);
            alert("내 판매를 가져오는데 실패")
            navigate("/");
        }
    };

    const handleSellTypeChange = (type) => {
        setSellType(type);
    };

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore && !loading) {
            if (sellType === "auction") {
                fetchAuctionSellList();
            } else {
                fetchProductSellList();
            }
        }
    };

    return (
        <>
            <div className="mySell-container">
                <div className="mySell-header">
                            <span className="mySellList-Icon">
                                <MdOutlineAssignmentLate className="icon" size="20"></MdOutlineAssignmentLate>
                                 <span>내 판매</span>
                            </span>
                </div>
                <div className="mySell-type-buttons">
                    <div
                        className={`mySell-type-button ${sellType === 'auction' ? 'selected' : ''}`}
                        onClick={() => handleSellTypeChange('auction')}
                    >
                        내 경매
                    </div>
                    <div
                        className={`mySell-type-button ${sellType === 'product' ? 'selected' : ''}`}
                        onClick={() => handleSellTypeChange('product')}
                    >
                        내 시간 판매
                    </div>
                </div>
                <div className="mySell-list">

                    {sellType === 'product' ? (
                        productSellList.length > 0 ? (
                            productSellList.map((product, index) => (
                                <div className="myProductSell-item" key={index}>
                                    <RecentProduct recentProduct={product}/>
                                </div>
                            ))
                        ) : ''
                    ) : (
                        auctionSellList.length > 0 ? (
                            auctionSellList.map((auction, index) => (
                                <div className="myAuctionSell-item" key={index}>
                                    <RecentAuction recentAuction={auction}/>
                                </div>
                            ))
                        ) : ''
                    )}
                    {/* 항상 loader를 마지막에 렌더링하도록 설정 */}
                    <div ref={loader}>
                        {loading ? (
                            <div className="loading-indicator">잠시만요!</div>
                        ) : hasMore ? null : (
                            <div className="no-more-items">항목이 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MySellList;
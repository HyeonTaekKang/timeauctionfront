import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import DOMPurify from "dompurify";
import '../../css/components/productDetail/RecommendProduct.css';
import {noApi, noTokenProductApi} from "../../api/axios";

const RecommendProduct = () => {
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

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

    const loadProducts = async () => {
        setLoading(true);
        const lastId = productList.length > 0 ? productList[productList.length - 1].id : null;
        let requestURL = '/product/recents';
        if (lastId) {
            requestURL += `?lastId=${lastId}`;
        }
        try {
            const response = await noApi.get(requestURL);
            const newProducts = response.data.data; // 불필요한 맵핑 제거
            setProductList((prevProducts) => [...prevProducts, ...newProducts]);
            setLoading(false);

            if (response.data.data.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading products:", error);
            setLoading(false);
        }
    };

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore && !loading) {
            loadProducts();
        }
    };

    return (
        <div className="recommendProduct-list-container">
            {productList.map((product, index) => (
                <Link to={`/product/${product.id}`} key={index} className="recommendProduct-item">
                    <div className="recommendProduct-thumbnail">
                        <img
                            className={`recommendProduct-thumbnail ${product.productSaleStatus==='SOLD' ? 'sold' : ''}`}
                            src={`https://timeauction-productthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/` + `${product.thumbNailUrl}`}
                            alt="Thumbnail"
                        />
                        {product.productSaleStatus==='SOLD' && (
                            <div className="sold-overlay">
                                <span>시간판매 완료</span>
                            </div>
                        )}
                    </div>

                    <div className="recommendProduct-details">
                            <span className="recommendProduct-title">
                                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product.productTitle)}}></div>
                            </span>

                        {/*<p className="recommendAuction-description">*/}
                        {/*    {DOMPurify.sanitize(auction.description, {*/}
                        {/*        ALLOWED_TAGS: [],*/}
                        {/*    })}s*/}
                        {/*</p>*/}

                        <div className="recommendProduct-info">
                            <div className="recommendProduct-userNickname">{product.sellerNickName}</div>
                            <div className="recommendProduct-amount">{product.productPrice}원 (시간)</div>
                        </div>
                    </div>
                </Link>
            ))}
            <div ref={loader}>
                {loading ? (
                    <></>
                ) : hasMore ? null : (
                    <></>
                )}
            </div>
        </div>
    )

};

export default RecommendProduct;
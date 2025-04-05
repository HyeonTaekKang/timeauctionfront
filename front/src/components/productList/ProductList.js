import React, {useEffect, useRef, useState} from 'react';
import '../../css/components/productList/ProductList.css';
import {Link} from "react-router-dom";
import RecentProduct from "../recentProduct/RecentProduct";
import {MdAssignmentLate} from "react-icons/md";
import {noApi, noTokenProductApi} from "../../api/axios";
import 'react-loading-skeleton/dist/skeleton.css';

const ProductList = () => {
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
            const response = await noApi.get(requestURL);
            setProductList((prevProducts) => [...prevProducts, ...response.data.data]);
            setLoading(false);
            if (response.data.data.length === 0) {
                setHasMore(false);
            }
        };

        const handleObserver = (entities) => {
            const target = entities[0];
            if (target.isIntersecting && hasMore && !loading) {
                loadProducts();
            }
        };

        return (
            <>
                <div className="product-list-header">
                    <MdAssignmentLate size="19"/>
                    <span>시간 판매</span>
                </div>
                <div className="product-list-container">
                    {productList.length > 0 ? (
                        productList.map((product, index) => (
                            <Link to={`/product/${product.id}`} key={index} className="product-item">

                                <div className="product-details">
                                    <RecentProduct key={index} recentProduct={product}/>
                                </div>
                            </Link>
                        ))) : null}
                    <div ref={loader}>
                        {loading ? (
                            <div className="loading-indicator">잠시만요!</div>
                        ) : hasMore ? null : (
                            <div className="no-more-items"></div>
                        )}
                    </div>
                </div>
            </>

        );
    }
;

export default ProductList;
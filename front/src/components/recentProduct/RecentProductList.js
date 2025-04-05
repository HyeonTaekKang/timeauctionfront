import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../../css/components/recentProduct/RecentProductList.css';
import {useDispatch, useSelector} from "react-redux";
import {MdAssignmentLate} from "react-icons/md";
import {Link} from "react-router-dom";
import RecentProduct from "./RecentProduct";
import {noApi, noTokenProductApi} from "../../api/axios";
import Skeleton from "react-loading-skeleton";


const RecentProductList = () => {

    const dispatch = useDispatch();
    let sideNavigationState = useSelector((state)=> state.sideNavigationState)
    const [loading, setLoading] = useState(true);
    const [recentProductList , setRecentProductList] = useState([]);

    useEffect(() => {

        fetchRecentProductList();
    }, [dispatch]);

    const fetchRecentProductList = async () => {
        setLoading(true);

        try {
            const response = await noApi.get('/product/recents?limit=8');
            const recentProductList = response.data.data;
            setRecentProductList(recentProductList);

            console.log(recentProductList);
        } catch (error) {
            console.error('Failed to fetch product data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id={sideNavigationState ? "recentProductList-container-haveSideNavigation" : "recentProductList-container-notHaveSideNavigation"}>
            <h4 className="recentProductList-head">
                <span className="new-product">
                    <MdAssignmentLate size="19"/>
                    <span>최신 시간 판매</span>
                </span>
                <Link to={"/products"} className="see-more-product">더보기 ></Link>
            </h4>
            <div className="recentProductList-body">
                {loading ? (
                        Array(8).fill(null).map((_, index) => (
                            <div key={index} className="recent-product-skeleton"> {/* Skeleton에 class 추가 */}
                                <Skeleton height={150}/> {/* Adjust width and height */}
                                <Skeleton height={20}/> {/* Adjust width and height */}
                                <Skeleton height={20}/> {/* Adjust width and height */}
                            </div>
                        ))
                    ) : (
                    recentProductList.map((recentProduct, index) => (
                            <RecentProduct key={index} recentProduct={recentProduct}/>
                    ))
                )}
            </div>
        </section>
    );
};

export default RecentProductList;
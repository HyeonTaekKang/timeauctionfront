import React, {useEffect, useState} from 'react';
import axios from 'axios';
import RecentAuction from './RecentAuction';
import '../../css/components/recentAuction/RecentAuctionList.css';
import {useDispatch, useSelector} from "react-redux";
import {setRecentAuctionList} from "../../store/store";
import {MdAssignmentLate, MdOutlineTimer, MdTimer} from "react-icons/md";
import {Link} from "react-router-dom";
import {auctionApi, noApi, noApii} from "../../api/axios";
import Skeleton from "react-loading-skeleton";

const RecentAuctionList = () => {

    const dispatch = useDispatch();
    const recentAuctionList = useSelector(state => state.recentAuctionList);
    const [loading, setLoading] = useState(true);
    let sideNavigationState = useSelector((state) => state.sideNavigationState)

    useEffect(() => {
        const fetchRecentAuctionList = async () => {
            setLoading(true);

            try {
                const response = await noApi.get('/auction/recents?limit=8');
                const recentAuctionList = response.data.data; // 받은 JSON 응답의 "data" 배열

                dispatch(setRecentAuctionList(recentAuctionList));

                console.log(recentAuctionList);
            } catch (error) {
                console.error('Failed to fetch auction data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentAuctionList();
    }, [dispatch]);

    return (
        <section
            id={sideNavigationState ? "recentAuctionList-container-haveSideNavigation" : "recentAuctionList-container-notHaveSideNavigation"}>
            <h4 className="recentAuctionList-head">
                <span className="new-auction">
                    <MdTimer size="19"/>
                    <span>최신 시간 경매</span>
                </span>

                <Link to={"/auctions"} className="see-more-auction">더보기 ></Link>

            </h4>
            <div className="recentAuctionList-body">
                {loading ? (
                    Array(8).fill(null).map((_, index) => (
                        <div key={index} className="recent-product-skeleton"> {/* Skeleton에 class 추가 */}
                            <Skeleton height={150}/> {/* Adjust width and height */}
                            <Skeleton height={20}/> {/* Adjust width and height */}
                            <Skeleton height={20}/> {/* Adjust width and height */}
                        </div>
                    ))
                ) : (
                    recentAuctionList.map((recentAuction, index) => (
                        <RecentAuction key={index} recentAuction={recentAuction}/>
                    ))
                )}
            </div>
        </section>
    );
};

export default RecentAuctionList;
import React, {useEffect, useState} from 'react';
import '../../css/components/recentPost/RecentPostList.css';
import 'react-loading-skeleton/dist/skeleton.css';
import {useDispatch, useSelector} from "react-redux";
import RecentPost from "./RecentPost";
import {setRecentPostList} from "../../store/store";
import {BsChatSquareDotsFill} from "react-icons/bs";
import {Link} from "react-router-dom";
import {noApi, noTokenPostApi} from "../../api/axios";
import Skeleton from "react-loading-skeleton";

const RecentPostList = () => {

    const dispatch = useDispatch();
    const recentPostList = useSelector(state => state.recentPostList);
    let sideNavigationState = useSelector((state) => state.sideNavigationState)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentPostList = async () => {
            setLoading(true);

            try {
                const response = await noApi.get('/post/recents?limit=6');
                const recentPostList = response.data.data;

                dispatch(setRecentPostList(recentPostList));
            } catch (error) {
                console.error('Failed to fetch post data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentPostList();
    }, [dispatch]);

    return (
        <section
            id={sideNavigationState ? "recentPostList-container-haveSideNavigation" : "recentPostList-container-notHaveSideNavigation"}>
            <h4 className="recentPostList-head">
                            <span className="new-Post">
                                <BsChatSquareDotsFill size="19"></BsChatSquareDotsFill>
                                <span>커뮤니티</span>
                            </span>
                <Link to={"/posts"} className="see-more-post">더보기 ></Link>
            </h4>
        <div className="recentPostList-body">
            {loading ? (
                Array(8).fill(null).map((_, index) => (
                    <div key={index} className="recent-post-skeleton"> {/* Skeleton에 class 추가 */}
                        <Skeleton height={150}/> {/* Adjust width and height */}
                    </div>
                ))
            ) : (
                recentPostList.map((recentPost, index) => (
                    <RecentPost key={index} recentPost={recentPost} />
                ))
            )}
        </div>
        </section>);
};

export default RecentPostList;
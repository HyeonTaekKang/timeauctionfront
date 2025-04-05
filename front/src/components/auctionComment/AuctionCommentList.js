import React, {useEffect, useRef, useState} from 'react';
import {MdAssignmentLate} from "react-icons/md";
import {Link, useParams} from "react-router-dom";

import axios from "axios";
import AuctionComment from "./AuctionCommet";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const AuctionCommentList = ({ refresh }) => {
    const [auctionCommentList, setAuctionCommentList] = useState([]);
    const { auctionId } = useParams();

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '20px',
            threshold: 1.0,
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => observer.disconnect();
    }, [hasMore, loading]);

    useEffect(() => {

        // auctionId가 변경될 때마다 댓글 목록을 초기화
        setAuctionCommentList([]);
        setHasMore(true);
        loadAuctionComments();
    }, [auctionId , refresh]);

    const loadAuctionComments = async () => {
        if (!hasMore) return;

        setLoading(true);
        const lastComment = auctionCommentList[auctionCommentList.length - 1];
        let requestURL = `/auctions/${auctionId}/comments`;
        if (lastComment) {
            requestURL += `?lastId=${lastComment.id}`;
        }
        const response = await axios.get(requestURL);
        setAuctionCommentList((prevAuctionComment) => [...prevAuctionComment, ...response.data.data]);
        setLoading(false);
        if (response.data.data.length === 0) {
            setHasMore(false);
        }
    };

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && hasMore && !loading) {
            loadAuctionComments();
        }
    };

    return (
        <>
            <div className="auctionCommentList-body">
                {loading ? (
                    <p>Loading...</p>
                ) : auctionCommentList.length === 0 ? (
                    <p>댓글없음</p>
                ) : (
                    auctionCommentList.map((comment, index) => (
                        <AuctionComment key={index} comment={comment} />
                    ))
                )}
            </div>
            <div ref={loader}>
                {loading ? (
                    <></>
                ) : hasMore ? null : (
                    <></>
                )}
            </div>
        </>
    );
};

export default AuctionCommentList;
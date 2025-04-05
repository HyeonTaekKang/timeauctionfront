import React, {useState} from 'react';
import CreateAuctionComment from "./CreateAuctionComment";
import AuctionCommentList from "./AuctionCommentList";

const AuctionCommentContainer = () => {
    const [refresh, setRefresh] = useState(false);

    const handleCommentSubmit = () => {
        // 새로운 댓글이 등록되면 refresh 상태를 변경하여 AuctionCommentList가 다시 로드되도록 합니다.
        setRefresh((prev) => !prev);
    };

    return (
        <>
            <CreateAuctionComment onCommentSubmit={handleCommentSubmit} />
            <AuctionCommentList refresh={refresh} />
        </>
    );
};

export default AuctionCommentContainer;
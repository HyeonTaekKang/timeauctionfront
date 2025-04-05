import React from 'react';
import {Link} from 'react-router-dom';
import '../../css/components/header/UserAuctionTicketInfo.css';

const AuctionTicketInfoDropDown = ({ticketData}) => {

    const formatDateTime = (dateTime) => {
        const options = {
            year  : 'numeric',
            month : 'long',
            day   : 'numeric',
            hour  : '2-digit',
            minute: '2-digit',
            hour12: false,
        };
        return new Date(dateTime).toLocaleString('ko-KR', options);
    };

    if (ticketData.startDateTime && ticketData.endDateTime) {

        const currentTime = new Date(); // 현재 시간 가져오기
        const endDateTime = new Date(ticketData.endDateTime); // endDateTime을 Date 객체로 변환

        if (endDateTime > currentTime) {
            return (
                <div id={"userAuctionTicketInfo-dropDown"}>
                    <p className="userAuctionTicketInfo-dropDown-haveTicket">경매권을 가지고 있습니다.</p>
                    <p className="userAuctionTicketInfo-dropDown-date">유효기간: {formatDateTime(ticketData.startDateTime)}</p>
                    <p className="userAuctionTicketInfo-dropDown-date">~ {formatDateTime(ticketData.endDateTime)}</p>
                </div>
            );
        } else{
            return (
                <div id={"userAuctionTicketInfo-dropDown-noHave"}>
                    <p>경매권이 없습니다.</p>
                    <Link className="ticketPurchase-link" to="/purchase/auctionTicket">여기에서 구입하세요.</Link>
                </div>
            );
        }
    }else{
        return (
            <div id={"userAuctionTicketInfo-dropDown-noHave"}>
                <p>경매권이 없습니다.</p>
                <Link className="ticketPurchase-link" to="/purchase/auctionTicket">여기에서 구입하세요.</Link>
            </div>
        );
    }
};

export default AuctionTicketInfoDropDown;
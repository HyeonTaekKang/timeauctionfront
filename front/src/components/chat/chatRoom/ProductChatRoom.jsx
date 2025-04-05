import React, {useEffect, useState} from 'react';
import axios from "axios";
import Chat from "../chat/Chat";
import '../../../css/components/chat/chatRoom/ChatRoom.css'

const ProductChatRoom = ({room}) => {

    // // isSelected prop에 따라 적용할 CSS 클래스 결정 ==> 참여중인 채팅방을 회색으로 표시해주기 위한 처리
    // const roomItemClass = isSelected ? "room-item selected" : "room-item";

    // 채팅방 최신 메세지의 생성시간
    const latestMessageCreatedAt = new Date(room.latestMessageCreatedAt);

    // 현재 날짜 정보를 가져옴
    const currentDate = new Date();

    // 최신 메세지 Date 포맷팅
    // 최신 메시지가 오늘 생성되었다 => "오후 2:43"
    // 최신 메세지가 어제 생성되었다 => "어제"
    // 최신 메세지가 오늘, 어제도 아닌 날에 생성되었다 => "2023-11-21"
    // latestMessageCreatedAt와 currentDate를 비교하여 출력할 날짜 형식을 결정
    let displayDate;
    if (latestMessageCreatedAt.toDateString() === currentDate.toDateString()) {
        // 만약 latestMessageCreatedAt가 오늘 날짜라면, 시간만 표시
        displayDate = new Intl.DateTimeFormat('ko-KR', {
            hour  : 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(latestMessageCreatedAt);
    } else if (latestMessageCreatedAt.toDateString() === new Date(currentDate.getTime() - 86400000).toDateString()) {
        // 만약 latestMessageCreatedAt가 어제 날짜라면, '어제'라고 표시
        displayDate = "어제";
    } else {
        // 만약 latestMessageCreatedAt가 그 이전의 날짜라면, 날짜를 'yyyy-mm-dd' 형식으로 표시
        displayDate = latestMessageCreatedAt.toISOString().split('T')[0];
    }

    return (
        <div className="room-item">
            {/*<div className="room-img">*/}
            {/*    <img*/}
            {/*        className="product-image"*/}
            {/*        src={'/images/' + room.productImageUrl.split('\\').pop()}*/}
            {/*        alt="Thumbnail"*/}
            {/*    />*/}
            {/*</div>*/}
            <div className="room-detail-block">

                <div className="chatRoom-item-thumbnail-block">
                    <img
                        className="chatRoom-item-thumbnail"
                        src={'https://timeauction-productthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/' + room.productThumbnailUrl}
                        alt="Thumbnail"
                    />
                </div>

                <div className="room-detail">
                    <div className="room-title-room-latestMessageCreatedAt">
                        <span className="room-title" dangerouslySetInnerHTML={{__html: room.productTitle}}/>
                        <span className="room-latestMessageCreatedAt">{displayDate}</span>
                    </div>

                    <div className="room-latestMessage-unReadCount">
                        <div className="room-latestMessage">{room.latestMessage}</div>
                        {room.unreadMessageCount > 0 &&
                            <div className="room-unReadCount">{room.unreadMessageCount}</div>
                        }
                    </div>
                </div>

            </div>
        </div>
    );
};


export default ProductChatRoom;
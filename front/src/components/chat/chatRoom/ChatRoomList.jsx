import React, {useEffect, useState} from 'react';
import ProductChatRoom from "./ProductChatRoom";
import '../../../css/components/chat/chatRoom/ChatRoomList.css'
import Chat from "../chat/Chat";
import {chatApi} from "../../../api/axios";
import {useDispatch, useSelector} from "react-redux";
import {decrementUnReadMessageCount} from "../../../store/store";
import AuctionChatRoom from "./AuctionChatRoom";
import {IoClose} from "react-icons/io5";
import {BsChatLeftText} from "react-icons/bs";


// product + auction chatroomList
const ChatRoomList = React.forwardRef(({onClose}, ref) => {
        const dispatch = useDispatch();
        const [roomType, setRoomType] = useState('auction');
        const [productChatRooms, setProductChatRooms] = useState([]);
        const [auctionChatRooms, setAuctionChatRooms] = useState([]);
        const [loading, setLoading] = useState(true);
        let unReadMessageCount = useSelector((state) => state.unReadMessageCount);
        const [selectedChat, setSelectedChat] = useState(null); // 선택된 채팅방 정보 저장
        const [error, setError] = useState(null);

        // 참여중인 auction chatRoomList 가져오기
        const fetchAuctionChatRooms = async () => {
            setLoading(true);
            setError(null); // Reset error
            try {
                const response = await chatApi.get('/auction/chatRooms')
                setAuctionChatRooms(response.data.data);
                console.log(response.data.data)

            } catch (error) {
                console.error('Failed to fetch chat rooms:', error);
                setError('채팅방을 가져오는데 오류가 발생했습니다.'); // Set error message

                // // 오류 발생 시 구독 해제
                // if (selectedRoomId) {
                //     unsubscribeChat(selectedRoomId);
                // }
            } finally {
                setLoading(false);
            }
        };

        // 참여중인 product chatRoomList 가져오기
        const fetchProductChatRooms = async () => {
            setLoading(true);
            setError(null); // Reset error
            try {
                const response = await chatApi.get('/product/chatRooms')
                setProductChatRooms(response.data.data);
                console.log(response.data.data)

            } catch (error) {
                console.error('Failed to fetch chat rooms:', error);
                setError('채팅방을 가져오는데 오류가 발생했습니다.'); // Set error message

                // 오류 발생 시 구독 해제
                // if (selectedRoomId) {
                //     unsubscribeChat(selectedRoomId);
                // }
            } finally {
                setLoading(false);
            }
        };


        // 채팅방의 순서를 chatRooms의 최상위로 변경하는 함수
        const moveChatRoomToTop = (chatRoomId) => {
            if (roomType === 'product') {
                setProductChatRooms(prevChatRooms => {
                    const chatRoomIndex = prevChatRooms.findIndex(room => room.chatRoomId === chatRoomId);
                    const chatRoom = prevChatRooms[chatRoomIndex];
                    return [
                        chatRoom,
                        ...prevChatRooms.slice(0, chatRoomIndex),
                        ...prevChatRooms.slice(chatRoomIndex + 1)
                    ];
                });
            } else if (roomType === 'auction') {
                setAuctionChatRooms(prevChatRooms => {
                    const chatRoomIndex = prevChatRooms.findIndex(room => room.chatRoomId === chatRoomId);
                    const chatRoom = prevChatRooms[chatRoomIndex];
                    return [
                        chatRoom,
                        ...prevChatRooms.slice(0, chatRoomIndex),
                        ...prevChatRooms.slice(chatRoomIndex + 1)
                    ];
                });
            }
        };

        // 채팅방의 최신 메세지와 최신 메세지가 보내진 시간을 업데이트하는 함수
        const updateChatRoomLatestMessageAndSendDateTime = (chatRoomId, message, sendDateTime) => {
            if (roomType === 'product') {
                setProductChatRooms(prevChatRooms => prevChatRooms.map(room => {
                    if (room.chatRoomId === chatRoomId) {
                        return {...room, latestMessage: message, latestMessageCreatedAt: sendDateTime};
                    }
                    return room;
                }));
                moveChatRoomToTop(chatRoomId);
            } else if (roomType === 'auction') {
                setAuctionChatRooms(prevChatRooms => prevChatRooms.map(room => {
                    if (room.chatRoomId === chatRoomId) {
                        return {...room, latestMessage: message, latestMessageCreatedAt: sendDateTime};
                    }
                    return room;
                }));
                moveChatRoomToTop(chatRoomId);
            }
        };

        useEffect(() => {
            // 초기 채팅방 목록 가져오기

            if (roomType == 'auction') {
                fetchAuctionChatRooms();
            }
            if (roomType == 'product') {
                fetchProductChatRooms();
            }

            // 컴포넌트 언마운트 시 구독 해제
            // return () => {
            //     if (selectedRoomId) {
            //         unsubscribeChat(selectedRoomId); // 현재 선택된 채팅방에서 구독 해제
            //     }
            // };
        }, [roomType]);

        // useEffect(() => {
        //     // 이전 채팅방의 ID 업데이트
        //     setPreviousRoomId(selectedRoomId);
        // }, [selectedRoomId]);

        const handleRoomClick = (newRoomId, auctionId, productId) => {
            decrementMessageCount(newRoomId);
            setUnReadCountZero(newRoomId);
            setSelectedChat({chatRoomId: newRoomId, roomType, auctionId, productId}); // 선택된 채팅방 정보 저장
        };

        // const unsubscribeChat = async (roomId) => {
        //     try {
        //
        //         // API 요청 시 Authorization 헤더 추가
        //         await api.post(`/chatroom/unsubscribe/${roomId}`);
        //
        //     } catch (error) {
        //         console.log('Error unsubscribing:', error); // 에러 로그 추가
        //     }
        // };

        const decrementMessageCount = (roomId) => {
            const selectedRoom = roomType === 'product' ?
                productChatRooms.find(room => room.chatRoomId === roomId) :
                auctionChatRooms.find(room => room.chatRoomId === roomId);

            if (selectedRoom) {
                const unreadCount = selectedRoom.unreadMessageCount;
                dispatch(decrementUnReadMessageCount(unreadCount));
            }
        };

        const setUnReadCountZero = (roomId) => {
            if (roomType === 'product') {
                const newChatRooms = [...productChatRooms];
                for (let room of newChatRooms) {
                    if (room.chatRoomId === roomId) {
                        room.unreadMessageCount = 0;
                        break;
                    }
                }
                setProductChatRooms(newChatRooms);
            } else if (roomType === 'auction') {
                const newChatRooms = [...auctionChatRooms];
                for (let room of newChatRooms) {
                    if (room.chatRoomId === roomId) {
                        room.unreadMessageCount = 0;
                        break;
                    }
                }
                setAuctionChatRooms(newChatRooms);
            }
        };

        // 외부 영역 클릭 시 처리 함수: 부모 컴포넌트로부터 전달받은 onClose 함수 호출
        const handleClickOutside = (event) => {
            if (event.target === event.currentTarget) {
                onClose();
            }
        };

        const handleRoomTypeChange = (type) => {
            setRoomType(type);
        };

        const handleChatClose = () => {
            setSelectedChat(null); // 채팅 종료 시 선택된 채팅방 정보 초기화
        };

        return (
            // 외부 영역 클릭 시 처리 함수 연결: onClick 속성에 handleClickOutside 함수 연결
            <>
                <div id="chatRoomList-chat-container" onClick={handleClickOutside} ref={ref}>
                    <div className="chat-container">
                        {selectedChat ? ( // 선택된 채팅방이 있으면 Chat 컴포넌트 표시
                            <Chat
                                chatRoomId={selectedChat.chatRoomId}
                                roomType={selectedChat.roomType}
                                auctionId={selectedChat.auctionId}
                                productId={selectedChat.productId}
                                onClose={handleChatClose}
                                // 필요한 props 전달
                            />
                        ) : ( // 선택된 채팅방이 없으면 ChatRoomList 표시
                            <>
                                <div className="chatRoomList-header">
                            <span className="chatRoomList-chatIcon">
                                <BsChatLeftText/>
                                <span>채팅</span>
                            </span>
                                    <span className="close-chatList" onClick={onClose}>
                                <IoClose size={20}/>
                            </span>
                                </div>
                                <div className="room-type-buttons">
                                    <div
                                        className={`room-type-button ${roomType === 'auction' ? 'selected' : ''}`}
                                        onClick={() => handleRoomTypeChange('auction')}
                                    >
                                        경매 채팅방
                                    </div>
                                    <div
                                        className={`room-type-button ${roomType === 'product' ? 'selected' : ''}`}
                                        onClick={() => handleRoomTypeChange('product')}
                                    >
                                        일반판매 채팅방
                                    </div>
                                </div>
                                <div className="chat-room-list">
                                    {error ? (
                                        <>
                                            <p>{error}</p>
                                            <button
                                                onClick={() => roomType === 'product' ? fetchProductChatRooms() : fetchAuctionChatRooms()}>
                                                다시 가져오기
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {loading ? (
                                                <div className="loader">로딩 중...</div> // 로딩 스피너 표시
                                            ) : (
                                                <>
                                                    {roomType === 'product' ? (
                                                        productChatRooms.length > 0 ? (
                                                            productChatRooms.map((room, index) => (
                                                                <div className="chat-room-item" key={index}
                                                                     onClick={() => handleRoomClick(room.chatRoomId, null, room.productId)}>
                                                                    <ProductChatRoom room={room}/>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="noChatRoom">참여중인 일반판매 채팅방이 없습니다.</p>
                                                        )
                                                    ) : (
                                                        auctionChatRooms.length > 0 ? (
                                                            auctionChatRooms.map((room, index) => (
                                                                <div className="chat-room-item" key={index}
                                                                     onClick={() => handleRoomClick(room.chatRoomId, room.auctionId, null)}>
                                                                    <AuctionChatRoom room={room}/>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="noChatRoom">참여중인 경매 채팅방이 없습니다.</p>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>
        )
    }
);

export default ChatRoomList;
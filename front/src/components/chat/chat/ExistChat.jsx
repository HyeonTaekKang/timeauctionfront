import React, {useEffect, useRef, useState} from 'react';
import * as StompJs from "@stomp/stompjs";
import SockJS from 'sockjs-client';
import axios from "axios";
import {useSelector} from "react-redux";
import '../../../css/components/chat/chat/ExistChat.css'
import {api, chatApi, productApi} from "../../../api/axios";
import {IoClose} from "react-icons/io5";

const ExistChat = React.forwardRef(({
                                        onClose,
                                        chatRoomId,
                                        product
                                    }, ref) => { // updateChatRooomLatestMessageAndSendTime : "ProductChatRoom 컴포넌트에서 채팅방의 최신 메세지와 보낸 시간을 update합니다"
    let accessToken = localStorage.getItem('accessToken');
    const [stompClient, setStompClient] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [roomDetail, setRoomDetail] = useState(null);

    const [messages, setMessages] = useState([]);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const loginUserData = JSON.parse(localStorage.getItem('userInfo')); // JSON으로 파싱
    const subscriptionRef = useRef(null); // useRef로 subscription 관리
    let isSending = false; // 중복 전송 방지 플래그
    // const [createdRoomId, setCreatedRoomId] = useState(null); // 첫 메세지를 보내고 채팅방이 생성될 때 response로 받아온 chatRoomId를 저장하기 위한 state

    const scrollRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleBackButton = (event) => {
            event.preventDefault();
            onClose(); // 부모 컴포넌트의 onClose 호출
        };

        // popstate 이벤트 리스너 등록
        window.addEventListener('popstate', handleBackButton);

        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [onClose]);

    useEffect(() => {

        if (chatRoomId && !stompClient) {
            connect();
        }
    }, [chatRoomId]);


    useEffect(() => {
        console.log(product);
        fetchProductDetails(product.id);
        console.log(product.id);
    }, []);

    const fetchProductDetails = async (id) => {
        try {
            const response = await api.get(`/product/${id}`);
            const productDetail = response.data;
            setRoomDetail(productDetail);
        } catch (error) {
            console.error('Failed to fetch product details:', error);
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    // chatRoomId가 존재하고 , connect() 메서드를 통해 stomClient가 초기화 되면 채팅방 구독을 진행
    // 채팅방 history 채팅들을 가져오는 fetchHistory() 실행
    // chatRoomId가 변경될 때마다 채팅방을 새로 구독합니다.
    useEffect(() => {
        const handleSubscription = async () => {
            if (chatRoomId && stompClient) {
                console.log("Subscribing to chat room:", chatRoomId); // 구독 시점 로그
                await subscribe(chatRoomId); // 구독 함수 호출
                await fetchChatHistory(); // 채팅 기록 가져오기
            }
        };

        handleSubscription();

        return () => {
            if (stompClient) {
                unsubscribeChat(chatRoomId);
            }
        }
    }, [chatRoomId, stompClient]); // chatRoomId 의존성 제거

    // stomp 연결
    const connect = () => {
        if (!stompClient) {
            const socket = new SockJS('https://timeauction.net/ws');
            const newStompClient = StompJs.Stomp.over(() => socket);

            // Authorization 헤더를 connect 메서드의 두 번째 매개변수로 전달
            newStompClient.connect(
                {chatRoomId: chatRoomId, roomType: "product", Authorization: `Bearer ${accessToken}`}, // 헤더 추가
                function (frame) {
                    console.log('Connected to WebSocket');
                    setStompClient(newStompClient);
                },
                function (error) {
                    console.error('WebSocket connection error: ', error);
                }
            );
        }
    }

    const unsubscribeChat = async (roomId) => {
        try {
            console.log('Unsubscribing from room:', roomId); // 로그 추가
            if (subscriptionRef.current) {
                // 추가 헤더를 포함하여 구독 해제
                await stompClient.unsubscribe(subscriptionRef.current.id, {
                    roomId       : roomId, // roomId를 헤더에 추가
                    Authorization: `Bearer ${accessToken}`
                });
                console.log('Unsubscribed successfully');
                subscriptionRef.current = null; // 구독 상태 초기화
            }
        } catch (error) {
            console.log('Error unsubscribing:', error); // 에러 로그 추가
        }
    };

    // 채팅방의 history 채팅들을 가져오는 메서드 ( 20개씩 가져옴 )
    const fetchChatHistory = async () => {
        try {
            const response = await chatApi.get(`/chatMessage/recent/${chatRoomId}/product?page=1&size=20`);

            setMessages(response.data.data);
            console.log(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const subscribe = async (roomId) => {

        // if (subscription) {
        //     // 이전 채팅방 구독 해제
        //     if (previousRoomId) {
        //         await unsubscribeChat(previousRoomId);
        //     }
        // }

        const newSubscription = await stompClient.subscribe(`/topic/chat/${roomId}`, (messageOutput) => {
                let receivedMessageObject = JSON.parse(messageOutput.body);

                // 메세지를 상태에 저장
                setReceivedMessage(receivedMessageObject);
                if (receivedMessageObject.contentType === 'ENTER') {
                    // 상대방이 채팅방에 들어올 때 내 메시지의 readCount를 0으로 변경
                    setMessages((prevMessages) => {
                        return prevMessages.map((message) => {
                            if (message.senderId === loginUserData.id && message.readCount === 1) {
                                return {...message, readCount: 0}; // readCount를 0으로 업데이트
                            }
                            return message;
                        });
                    });
                } else {
                    setMessages((prevMessages) => [...prevMessages, receivedMessageObject]);
                    sendNotification(receivedMessageObject);
                }
            }, {chatRoomId: roomId, Authorization: `Bearer ${accessToken}`} // 헤더 값 추가
        )
        subscriptionRef.current = newSubscription;
        console.log("Subscribed to chat room:", roomId); // 구독 성공 로그
    };

    // 채팅을 보내는 메서드입니다.
    const sendMessage = (event) => {
        event.preventDefault();

        if (isSending) return; // 중복 호출 방지
        isSending = true; // 전송 시작

        if (messageInput.trim() !== "") {
            let messageContentObject = {
                roomType  : "product",
                chatRoomId: chatRoomId,
                message   : messageInput,
                senderId  : loginUserData.id
            };
            console.log(messageContentObject);

            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            stompClient.send(`/app/chat.sendMessage/${chatRoomId}`, headers, JSON.stringify(messageContentObject), () => {
                const sendDateTime = new Date().toISOString();
                // updateChatRoomLatestMessageAndSendDateTime && updateChatRoomLatestMessageAndSendDateTime(chatRoomId, messageInput, sendDateTime);
                // moveChatRoomToTop && moveChatRoomToTop(chatRoomId);
                isSending = false; // 전송 완료 후 플래그 초기화
            });
            setMessageInput("");
        } else {
            isSending = false; // 메시지가 비어있을 경우에도 초기화
        }
    };

    const sendNotification = async (receivedMessageObject) => {
        try {
            // 알림을 전송하는 API를 호출합니다.
            await chatApi.post(`/chatMessage/notification/product`, receivedMessageObject);
        } catch (error) {
            console.error("메시지 저장과 알림 전송 중 오류가 발생했습니다.", error);
        }
    }

    // 채팅 보내진 시간을 format 하기 위한 메서드 ( ex . 오전 3 : 47 , 오후 3: 47 )
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {hour: 'numeric', minute: 'numeric', hour12: true}).format(date);
    };

    // 채팅의 생성 연 , 월 , 일 , 요일을 포맷팅 하기 위한 메서드 , groupByDate() 를 통해 요일별로 그룹화된 메세지들의 date를 포맷팅함.
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ko-KR', {
            year   : 'numeric',
            month  : 'long',
            day    : 'numeric',
            weekday: 'long'
        }).format(date);
    };

    // 요일별로 메세지들을 그룹화해서 채팅창에 해당 채팅의 생성 연도 , 월 , 일을 표시해주기 위해 만든 메서드 ( ex . 2023년 11월 24일 금요일 )
    // return 예시
    // {
    //     "2023-11-24": [
    //     { /* 메시지 1 */ },
    //     { /* 메시지 2 */ },
    //     { /* 메시지 3 */ },
    //     // 더 많은 메시지들...
    // ],
    //     "2023-11-25": [
    //     { /* 메시지 4 */ },
    //     { /* 메시지 5 */ },
    //     // 더 많은 메시지들...
    // ],
    //     // 더 많은 날짜 그룹들...
    // }
    const groupByDate = (messages) => {
        return messages.reduce((groups, message) => {
            const date = new Date(message.sendDateTime);
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(message);
            return groups;
        }, {});
    };

    // 연속으로 1분동안 계속 메세지를 보냈으면 메세지 상단에만 user icon과 이름 , 그리고 마지막 메세지에 보낸 시간을 표시해주기 위해 만든 메서드
    // 이게 없으면 모든 문자마다 user icon과 이름 , 보낸 시간이 나타남.
    const groupBySenderAndMinute = (messages) => {
        return messages.reduce((groups, message) => {
            const date = new Date(message.sendDateTime);
            const minuteKey = `${date.getHours()}:${date.getMinutes()}`;
            message.minuteKey = minuteKey; // 메시지에 minuteKey 속성 추가
            const prevMessage = groups.length > 0 ? groups[groups.length - 1][0] : null;
            if (prevMessage && prevMessage.senderId === message.senderId && prevMessage.minuteKey === minuteKey) {
                groups[groups.length - 1].push(message);
            } else {
                groups.push([message]);
            }
            return groups;
        }, []);
    };

    // Object.entires(groupByDate(messages)) 예상 데이터
    // [
    //     ["2023-11-24", [
    //         { /* 메시지 1 */ },
    //         { /* 메시지 2 */ },
    //         { /* 메시지 3 */ },
    //         // 더 많은 메시지들...
    //     ]],
    //     ["2023-11-25", [
    //         { /* 메시지 4 */ },
    //         { /* 메시지 5 */ },
    //         // 더 많은 메시지들...
    //     ]],
    //     // 더 많은 날짜 그룹들...
    // ]

    const formatAuctionTime = (isoString) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    // 외부 영역 클릭 시 처리 함수: 부모 컴포넌트로부터 전달받은 onClose 함수 호출
    const handleClickOutside = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="exist-chat-room" onClick={handleClickOutside} ref={ref}>
            {/* 채팅 헤더 */}
            <div className="chat-header">
                {/* 제품 정보 표시 */}
                {roomDetail && (
                    <div className="chat-product-detail">
                        <div className="chat-product-detail-container">
                            <img
                                src={'https://timeauction-productthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/' + roomDetail.thumbNailUrl}
                                alt="Thumbnail"
                                className="chat-product-thumbnail"
                            />
                            <div className="chat-product-info">
                                <div className="chat-product-title"
                                     dangerouslySetInnerHTML={{__html: roomDetail.productTitle}}/>
                                <p className="chat-product-nickname">판매인: {roomDetail.sellerNickName}</p>
                            </div>
                        </div>
                        <span className="close-chat" onClick={onClose}>
                            <IoClose size={20}/>
                        </span>
                    </div>
                )}

            </div>
            <div className="chat-block" ref={scrollRef}>
                {Object.entries(groupByDate(messages)).map(([date, messagesOnDate], index) =>
                    <div key={index}>
                        {/*해당 채팅이 보내진 연월일*/}
                        {/*{formatDate(messagesOnDate[0].sendDateTime)}는 해당 날짜의 첫 번째 메시지의 sendDateTime을 이용해서 날짜를 포맷팅하고, 이를 출력*/}
                        {/*날짜 순으로 그룹화된 채팅의 제일 첫번째 메세지의 sendDateTime으로 그 채팅의 datetTime을 파악하여 display함.*/}
                        <div className="chats-date">{formatDate(messagesOnDate[0].sendDateTime)}</div>

                        {groupBySenderAndMinute(messagesOnDate).map((group, groupIndex) =>
                            <div key={groupIndex}>
                                {group.map((msg, index) => (
                                    <div key={index}
                                         className={`message-item ${msg.senderId === loginUserData.id ? 'my-message' : 'other-message'}`}>
                                        {/*{index === 0 && msg.senderId !== loginUserData.id &&*/}
                                        {/*    <>*/}
                                        {/*        <span className="other-user-metadata">*/}
                                        {/*        <img src={'/userIcon/' + msg.receiverIconUrl.split('\\').pop()}*/}
                                        {/*             alt="userIcon"/>*/}
                                        {/*            {msg.receiverNickname}*/}
                                        {/*        </span>*/}
                                        {/*    </>*/}
                                        {/*}*/}
                                        <div
                                            className={`message-content-and-send-time ${msg.senderId === loginUserData.id ? 'my' : 'other-user'}`}>
                                            <span
                                                className={`message-content ${msg.senderId === loginUserData.id ? 'my' : 'other-user'}`}>
                                                    {msg.message}
                                                </span>

                                            <div className="message-detail">
                                                {msg.senderId === loginUserData.id && msg.readCount === 1 &&
                                                    <span className="read-status">1</span>
                                                }
                                                {index === group.length - 1 &&
                                                    <span
                                                        className="message-send-time">{formatTime(msg.sendDateTime)}</span>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="chat-input-block">
                <input className="message-input" value={messageInput}
                       onChange={(e) => setMessageInput(e.target.value)}
                       onKeyDown={(e) => {
                           if (e.key === 'Enter') { // 엔터 키가 눌렸을 때
                               sendMessage(e); // sendMessage 호출
                           }
                       }}
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
})

export default ExistChat;
import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import '../../css/components/header/Header.css';
import {
    increaseUnReadMessageCount,
    isUserLogin,
    isUserLogout,
    setLoginUserData,
    setSideNavigationState,
    setUnReadMessageCount
} from "../../store/store";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {AiOutlineMenu, AiOutlineSearch} from "react-icons/ai";
import UserMenuDropDown from "../userMenuDropDown/UserMenuDropDown";
import SearchBar from "../search/SearchBar";
import {FiChevronDown, FiChevronUp, FiPlusCircle} from "react-icons/fi";
import ChatRoomList from "../chat/chatRoom/ChatRoomList";
import {api, chatApi} from "../../api/axios";
import AuctionTicketIcon from "./AuctionTicketIcon";
import NotificationIcon from "./NotificationIcon";
import ChatIcon from "./ChatIcon";
import {IoTicketOutline} from "react-icons/io5";
import {VscBell} from "react-icons/vsc";
import {BsChatLeftText} from "react-icons/bs";
import {EventSourcePolyfill, NativeEventSource} from "event-source-polyfill";
import FullScreenSearch from "../search/FullScreenSearch";
import SideNavigation from "../sideNavigation/SideNavigation";
import FullScreenNavigation from "../sideNavigation/FullScreenNavigation";


const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    let accessToken = localStorage.getItem("accessToken")
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    let unReadMessageCount = useSelector((state) => state.unReadMessageCount);

    const [chatNotifications, setChatNotifications] = useState([]); // 채팅 알림
    const [otherNotifications, setOtherNotifications] = useState(0); // 여러 알림
    // const [loginUserData, setLoginUserData] = useState(null);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const [isFullScreen, setIsFullScreen] = useState(false); // 검색창 ( 모바일 )
    const [isNavigationIconClick , setIsNavigationIconClick] = useState(false); // navigation ( 모바일 )
    // const cognitoLoginUrl = '/oauth2/authorization/cognito'

    useEffect(() => {

        if (accessToken && userInfo) {
            // 엑세스 토큰이 존재하면 유저 정보를 가져오는 API 호출
            fetchUnreadMessageCount(); // 컴포넌트가 마운트될 때 읽지 않은 메시지 수를 가져옴
            const eventSource = connectToSSE(); // SSE 연결 설정

            // 컴포넌트 언마운트 시 SSE 연결 종료
            return () => {
                eventSource.close();
            };
        }
    }, []);

    // 읽지 않은 메시지 수를 초기화하는 함수
    const fetchUnreadMessageCount = async () => {
        try {
            const response = await chatApi.get('/chatMessage/countUnReadMessages');
            dispatch(setUnReadMessageCount(response.data));
        } catch (error) {
            console.error("Error fetching unread message count:", error);
        }
    };

    // SSE 연결을 설정하는 함수
    const connectToSSE = () => {
        const EventSource = EventSourcePolyfill;
        const eventSource = new EventSource('https://api.timeauction.net/notification/connect', {
            headers        : {
                Authorization: `Bearer ${accessToken}` // JWT를 포함한 헤더 설정
            },
            withCredentials: true,
        });

        // "chat" 이벤트 수신 시 호출되는 핸들러
        eventSource.addEventListener("chat", function (event) {
            // 새로운 메시지를 받을 때 상태를 1 증가
            dispatch(increaseUnReadMessageCount());
        });

        // 오류 발생 시 호출되는 핸들러
        eventSource.onerror = async (event) => {
            console.error("Error occurred in EventSource:", event);
            eventSource.close(); // 오류 발생 시 연결 종료
        };

        return eventSource; // 외부에서 사용할 수 있도록 eventSource 반환
    };

    const chatRef = useRef(null);

    useEffect(() => {
        if (!isChatOpen) return;  // If the chat window is not open, do nothing.

        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setIsChatOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isChatOpen]);


    // const handleLogout = async () => {
    //     try {
    //         // 로그아웃 처리 로직
    //         await api.post("/auth/logout")
    //
    //         navigate('/')
    //         localStorage.removeItem("accessToken")
    //         localStorage.removeItem("userInfo")
    //
    //     } catch (error) {
    //         alert(error.response.data.message);
    //     }
    // }


    // 채팅
    // 채팅 아이콘 클릭 handle 메서드
    // 채팅 아이콘을 클릭시 chatOpen 메서드가 isChatOpen state가 변경됨
    // isChatOpen이 true일 경우 chatOpen이 true가 되면서 <ChatRoomList> 컴포넌트가 보임
    // 보지 않은 채팅 알림이 있을 경우 알림을 없애고 , 서버에 해당 알림들 읽음처리 요청을 보냄
    const handleToggleChat = async () => {
        // 읽음 처리 API 호출 (예시)
        try {
            // await axios.post('/notification/read', { type: 'chat' }, { withCredentials: true });
            setIsChatOpen(prevState => !prevState);
            // 알림 수를 0으로 만듦
            setChatNotifications([]);
        } catch (error) {
            console.error(error);
        }


    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const toggleSideNavigation = () => {
        dispatch(setSideNavigationState())
    };

    const redirectLoginPage = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };

    const handleIconClick = () => {
        setIsFullScreen(true);
    };

    const handleNavigationIconClick = () => {
        setIsNavigationIconClick(true);
    };


    return (
        <header className="header-container">
            <div className="left-container">
                <div className="logo-container">
                    <a id="home-button" href="/">
                        <span style={{fontSize: '14px', fontWeight: 'bold'}}>TIMEAUCTION</span>
                    </a>
                </div>
                {/*<div className="nav-container">*/}
                {/*    <Link to={"/auctions"}> 최신 경매</Link>*/}
                {/*    <Link to={"/products"}> 최신 판매</Link>*/}
                {/*    <Link to={"/community"}> 커뮤니티</Link>*/}
                {/*</div>*/}
            </div>
            <div className="search-bar-container">
                <SearchBar></SearchBar>
            </div>
            <div className="right-container">
                {accessToken && userInfo ? (
                    <>
                        <div className="phone-search-icon">
                            {isFullScreen ? (
                                <FullScreenSearch setIsFullScreen={setIsFullScreen}/>
                            ) : (
                                <div className="search-container" onClick={handleIconClick}>
                                    <AiOutlineSearch size={17}/>
                                    {/*<div className="navigation-container" onClick={toggleSideNavigation}>*/}
                                    {/*    <div className="navigation-bar">*/}
                                    {/*        <AiOutlineMenu className="icon" size="18"/>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            )}
                        </div>
                        <div className="phone-chat-icon">
                            <ChatIcon onClick={handleToggleChat} countUnReadMessages={unReadMessageCount}
                                      IconComponent={BsChatLeftText} tooltipText="채팅"/>
                        </div>
                        <div className="phone-navigation-container">
                            {isNavigationIconClick ? (
                                <FullScreenNavigation setIsNavigationIconClick={setIsNavigationIconClick}></FullScreenNavigation>
                            ) : (
                                <div className="phone-navigation" onClick={handleNavigationIconClick}>
                                    <AiOutlineMenu size={17}></AiOutlineMenu>
                                </div>
                            )}

                        </div>
                        <div className="user-container">
                            <Link to="/select/sellingType">
                                <div id="create-auction-btn">
                                    <FiPlusCircle size="15" color="#FF55AA"></FiPlusCircle>
                                    <span>시간 판매하기</span>
                                </div>
                            </Link>
                            <div className="header-icons">

                                <AuctionTicketIcon
                                    IconComponent={IoTicketOutline}
                                    ticketData={{
                                        startDateTime: userInfo.startDateTime,
                                        endDateTime  : userInfo.endDateTime,
                                    }}
                                />

                                <NotificationIcon IconComponent={VscBell} tooltipText="알림"/>
                                <ChatIcon onClick={handleToggleChat} countUnReadMessages={unReadMessageCount}
                                          IconComponent={BsChatLeftText} tooltipText="채팅"/>
                            </div>
                        </div>

                        <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="user-info"
                        >
                            {userInfo && userInfo.nickName}
                            {isHovering ? <FiChevronUp/> : <FiChevronDown/>}
                            {isHovering && (
                                <div className="user-menu-container">
                                    <UserMenuDropDown/>
                                </div>
                            )}
                        </div>
                        {/*채팅방*/}
                        {isChatOpen && (<ChatRoomList ref={chatRef} onClose={() => setIsChatOpen(false)}/>)}
                    </>

                ) : (
                    <>
                        <div className="phone-search-icon">
                            {isFullScreen ? (
                                <FullScreenSearch setIsFullScreen={setIsFullScreen}/>
                            ) : (
                                <div className="search-container" onClick={handleIconClick}>
                                    <AiOutlineSearch size={17}/>
                                    {/*<div className="navigation-container" onClick={toggleSideNavigation}>*/}
                                    {/*    <div className="navigation-bar">*/}
                                    {/*        <AiOutlineMenu className="icon" size="18"/>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                </div>
                            )}
                        </div>
                        <button className="login-button" onClick={redirectLoginPage}>
                            로그인
                        </button>

                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
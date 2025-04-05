import React from 'react';
import Header from "../header/Header";
import {IoClose, IoPeopleCircleSharp, IoTicketOutline} from "react-icons/io5";
import {FiPlusCircle} from "react-icons/fi";
import {Link} from "react-router-dom";
import {MdOutlineAssignmentLate} from "react-icons/md";
import AuctionTicketIcon from "../header/AuctionTicketIcon";
import {CiLogin} from "react-icons/ci";
import {api, authApi} from "../../api/axios";
import Cookies from "js-cookie";
import "../../../src/css/components/sideNavigation/FullScreenNavigation.css";
import AuctionTicketInfoDropDown from "../header/AuctionTicketInfoDropDown";


const FullScreenNavigation = ({setIsNavigationIconClick}) => {

    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // JSON으로 파싱

    const handleLogout = async () => {
        try {

            await api.post('/auth/logout')

            // 로컬 스토리지와 쿠키에서 토큰 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userInfo');
            Cookies.remove('REFRESH_TOKEN');

            window.location.reload();

        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleCloseNavigation = () => {
        setIsNavigationIconClick(false); // 전체 화면 네비게이션 모드 종료
    };

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

    return (
        <div className="full-screen-navigation-container">
            <header className="navigation-user-info-container">
                <div className="navigation-user-info">
                    <IoPeopleCircleSharp size={30} color="gray"/>
                    <span>{userInfo.nickName}님 반갑습니다!</span>
                </div>
                <div className="navigation-close-icon">
                    <IoClose onClick={handleCloseNavigation} size={20}/>
                </div>

            </header>
            <article className="navigation-contents-container">

                <Link to="/select/sellingType">
                    <div className="navigation-create-auction-btn">
                        <FiPlusCircle size="15" color="#FF55AA"></FiPlusCircle>
                        <span>시간 판매하기</span>
                    </div>
                </Link>

                <div>
                    <a className="endpoint" href="/mySell">
                        <div className="navigation-my-sell">
                            <MdOutlineAssignmentLate className="icon" size="20"></MdOutlineAssignmentLate>
                            <span>내 판매</span>
                        </div>

                    </a>
                </div>

                <div className="navigation-auctionTicket-info">
                    <AuctionTicketInfoDropDown
                        ticketData={{ startDateTime: userInfo.startDateTime, endDateTime: userInfo.endDateTime }}
                    />
                </div>
            </article>
            <footer>
                <div className="navigation-logout-btn" onClick={handleLogout}>
                    <CiLogin className="dropDown-icon" size="20"></CiLogin>
                    로그아웃
                </div>
            </footer>
        </div>
    );
};

export default FullScreenNavigation;
import React from 'react';
import axios from "axios";
import {deleteLoginUserData, isUserLogout} from "../../store/store";
import {useDispatch} from "react-redux";
import '../../css/components/userMenu/UserMenu.css';
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';

import { CiReceipt , CiUser , CiLogin} from "react-icons/ci";
import {api, authApi} from "../../api/axios";

const UserMenuDropDown = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const navigateToMySellPage = () => {
        navigate("/mySell");
    };

    return (
        <div id="userMenu-dropDown">
            <div className="my-auction" onClick={navigateToMySellPage}>
                <CiReceipt className="dropDown-icon" size="20"></CiReceipt>
                내 판매
            </div>
            <div className="logout-btn" onClick={handleLogout}>
                <CiLogin className="dropDown-icon" size="20"></CiLogin>
                로그아웃
            </div>
        </div>
    );
};

export default UserMenuDropDown;
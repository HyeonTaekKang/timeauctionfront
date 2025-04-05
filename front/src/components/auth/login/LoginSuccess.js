import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setAccessToken} from "../../../store/store";
import {api, authApi} from "../../../api/axios";
import searchParams from "lodash";

const LoginSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const accessToken = params.get('accessToken');
                if (accessToken) {
                    // 액세스 토큰을 로컬 스토리지에 저장
                    localStorage.setItem('accessToken', accessToken);

                    // 유저 정보 요청
                    const userInfoResponse = await authApi.get('/user/info', {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    // 유저 데이터를 로컬 스토리지에 저장
                    localStorage.setItem('userInfo', JSON.stringify(userInfoResponse.data));

                    // 홈으로 리디렉트
                    navigate('/', { replace: true });
                } else {
                    // 액세스 토큰이 없으면 로그인 페이지로 리디렉션
                    alert("로그인 실패")
                    navigate('/', { replace: true });
                }
            } catch (error) {
                alert("로그인 실패")
                console.error('액세스 토큰을 가져오는데 실패했습니다.', error);
                // 에러가 발생하면 로그인 페이지로 리디렉션
                navigate('/', { replace: true });
            }
        };

        fetchAccessToken();
    }, [dispatch, navigate, searchParams]);

    return (
        <div>로그인 중...</div>
    );
};

export default LoginSuccess;
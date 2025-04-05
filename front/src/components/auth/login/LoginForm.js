import React, { useRef, useState } from 'react';
import '../../../css/components/auth/login/LoginForm.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api, apii, authApi, noApi, noApii, noTokenAuthApi } from '../../../api/axios';
import { ClipLoader } from 'react-spinners'; // 로딩 스피너 추가

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const passwordInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        setIsLoading(true); // 로딩 시작

        if (!email) {
            setErrorMessage('아이디를 입력해 주세요.');
            setIsLoading(false); // 로딩 종료
            return;
        }

        if (!password) {
            setErrorMessage('비밀번호를 입력해 주세요.');
            setIsLoading(false); // 로딩 종료
            return;
        }

        try {
            const response = await noApi.post(
                '/auth/login',
                { email, password },
                {
                    withCredentials: true, // 쿠키를 포함하도록 설정
                }
            );
            const { accessToken } = response.data;

            // 엑세스 토큰과 유저 정보 로컬 스토리지에 저장
            localStorage.setItem('accessToken', accessToken);

            // 유저 정보 요청
            const userInfoResponse = await api.get('/auth/user/info');

            // 유저 데이터를 로컬스토리지에 저장
            localStorage.setItem('userInfo', JSON.stringify(userInfoResponse.data));

            navigate('/')
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // 로그인 실패 시 알림
                alert(error.response.data.message); // 서버에서 반환된 메시지
            } else {
                alert('로그인 요청 중 오류가 발생했습니다.');
                navigate('/')
            }
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>로그인</h2>
                <div>
                    <label htmlFor="emailInput">Email</label>
                    <input
                        type="email"
                        id="emailInput"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="이메일"
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div>
                    <label htmlFor="passwordInput">Password</label>
                    <input
                        type="password"
                        id="passwordInput"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="비밀번호"
                        ref={passwordInputRef}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <button type="button" onClick={handleLogin} disabled={isLoading}>
                    {isLoading ? <ClipLoader size={20} color={'#123abc'} /> : '로그인'}
                </button>

                <div className="signup-block">
                    <span>아직 회원이 아니신가요?</span>
                    <span className="signup-button" onClick={() => navigate('/signup')}>
                        회원가입 하기
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
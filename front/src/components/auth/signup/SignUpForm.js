import React, { useState } from 'react';
import '../../../css/components/auth/signup/Signup.css'
import axios from "axios";
import {noApi, noTokenAuthApi} from "../../../api/axios";

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userName: '',
        nickName: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/; // 최소 8자, 문자와 숫자 및 특수문자 포함

        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요';
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = '이메일 형식이 아닙니다. 다시 입력해주세요';
        }

        if (!formData.password) {
            newErrors.password = '패스워드를 입력해주세요';
        } else if (!passwordPattern.test(formData.password)) {
            newErrors.password = '패스워드는 최소 8자 이상, 문자와 숫자 및 특수문자를 포함해야 합니다.';
        }

        if (!formData.userName) {
            newErrors.userName = '이름을 입력해주세요';
        }

        if (!formData.nickName) {
            newErrors.nickName= '닉네임을 입력해주세요';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // 유효성 검사 통과 여부
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await noApi.post('/auth/signup', formData);
                alert(response.data); // 성공 메시지
                // 로그인 페이지로 리다이렉트
                window.location.href = '/login';
            } catch (error) {
                if (error.response) {
                    alert(error.response.data); // 서버에서 반환한 에러 메시지
                } else {
                    alert('회원가입 요청 중 오류가 발생했습니다.');
                    window.location.href = '/login';
                }
            }
        }
    };

    return (
        <div className="sign-up-container">
            <h1>회원가입</h1>
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <div>
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                           className={`signup-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <small className="error-text">{errors.email}</small>}
                </div>
                <div>
                    <label>패스워드</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`signup-input ${errors.password ? 'error' : ''}`}
                    />
                    {errors.password && <small className="error-text">{errors.password}</small>}
                </div>
                <div>
                    <label>이름</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className={`signup-input ${errors.userName ? 'error' : ''}`} // 이름
                    />
                    {errors.userName && <small className="error-text">{errors.userName}</small>}
                </div>
                <div>
                    <label>닉네임</label>
                    <input
                        type="text"
                        name="nickName"
                        value={formData.nickName}
                        onChange={handleChange}
                        className={`signup-input ${errors.nickName ? 'error' : ''}`} // 닉네임
                    />
                    {errors.nickName && <small className="error-text">{errors.nickName}</small>}
                </div>
                <button className="signup-submit-button" type="submit">가입하기</button>
            </form>
        </div>
    );
};

export default SignUpForm;

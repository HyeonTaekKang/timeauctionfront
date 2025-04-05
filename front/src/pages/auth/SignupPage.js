import React, {useEffect, useState} from 'react';
import axios from "axios";
import "./PasswordValidation.css";
import _ from "lodash";
import {redirect} from "react-router-dom";

const SignupPage = () => {

    // 이메일 state
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [isEmailDuplicated, setIsEmailDuplicated] = useState(false);
    const [emailValidity, setEmailValidity] = useState('');

    // 패스워드 state
    const [password, setPassword] = useState('');
    const [isPasswordTypeValid, setIsPasswordTypeValid] = useState(false); // 입력한 패스워드의 형태가 영문/숫자/특수문자 2가지 이상 조합이면서 길이가 8~20자인지 판단하는 state
    const [isConsecutiveValid, setIsConsecutiveValid] = useState(false); // 입력한 패스워드가 동일한 문자/숫자를 3개 이상 포함했는지 판단하는 state
    const [isSameAsEmail, setIsSameAsEmail] = useState(false); // 입력한 패스워드가 입력한 이메일과 동일한를 판단하는 state
    const [isClickedPasswordInput, setIsClickedPasswordInput] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    // 패스워드 확인 state
    const [confirmPassword, setConfirmPassword] = useState(''); // 사용자가 다시 입력한 비밀번호 state
    const [confirmPasswordValidity, setConfirmPasswordValidity] = useState('');


    // 이름 state
    const [name, setName] = useState('');

    // 닉네임 state
    const [nickName, setNickName] = useState('');

    // -------------------------------------------------------------------------------------------------

    // [ 이메일 관련 함수 ]

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        // setEmailValidity('');
        // setIsEmailDuplicated(false);
    };

    const handleEmailInputBlur = () => {
        validateEmail();
    };

    const validateEmail = () => {

        if (!email) {
            // setEmailError(true);
            setEmailValidity('이메일을 작성해주세요');
        } else {
            if (!isValidEmailFormat(email)) {
                // setEmailError(false)
                setEmailValidity('이메일을 올바르게 작성해주세요.')
            } else {
                // setEmailError(false)
                setEmailValidity('')
            }
        }
    };

    // 이메일 형태 검사 함수 ( 정규식 사용 ) => 이메일의 형태가 맞으면 true를 return
    const isValidEmailFormat = (email) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return emailRegex.test(email);
    }

    // -------------------------------------------------------------------------------------------------

    // [ 패스워드 관련 함수 ]

    // 패스워드 input이 바뀔때마다 실행되는 메서드
    // 패스워드 검사 메서드도 포함하고 있음 --> input값이 변할 때마다 패스워드 검사
    const handlePasswordChange = (event) => {
        const value = event.target.value;
        setPassword(value);
        validPasswordType(value)
        validPasswordConsecutive(value)
        validPasswordSameAsEmail(value)
    };

    const handleClickPasswordInput = () => {
        setIsClickedPasswordInput(true);
    };

    const validPasswordType = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        if (regex.test(password)) {
            setIsPasswordTypeValid(true)
            return true
        }
    }

    const validPasswordConsecutive = (password) => {
        const regex = /(.)\1\1/;
        if (!regex.test(password)) {
            setIsConsecutiveValid(true)
            return true
        }
    }

    const validPasswordSameAsEmail = (password) => {
        if (password === email) {
            setIsSameAsEmail(true)
        } else {
            setIsSameAsEmail(false)
        }
    }

    // -------------------------------------------------------------------------------------------------

    // [ 패스워드 확인 관련 함수 ]

    // 패스워드
    const validateConfirmPassword = () => {

        if (!confirmPassword) {
            // setEmailError(true);
            setConfirmPasswordValidity('패스워드를 한번더 작성해주세요');
        } else {
            if (isSamePassword() === false) {
                // setEmailError(false)
                setConfirmPasswordValidity('패스워드가 일치하지 않습니다')
            } else {
                // setEmailError(false)
                setConfirmPasswordValidity('패스워드가 일치합니다')
            }
        }
    };

    // 처음에 패스워드와 사용자가 다시 적은 패스워드가 일치하는지 판단
    const isSamePassword = () => {
        if (password === confirmPassword) {
            return true
        } else {
            return false
        }
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleConfirmPasswordInputBlur = () => {
        validateConfirmPassword();
    };

    // -------------------------------------------------------------------------------------------------

    // [ 이름 관련 함수 ]

    const handleNameChange = (event) => {
        setName(event.target.value);
    };


    // -------------------------------------------------------------------------------------------------

    // 닉네임 함수
    const handleNickNameChange = (event) => {
        setNickName(event.target.value);
    };

    const signupUser = () => {
        const url = "/signup/user"

        axios.post(url, {
                'email'   : email,
                'password': password,
                'userName'    : name,
                'nickName': nickName,

            },
            {headers: {"Content-Type": `application/json`}}
        )
            .then(
                () => {
                    alert("회원가입 성공!");
                    window.location.href = "/";
                })
            .catch((error) => alert(error.response.data.message))
    }

    // const isSignupButtonDisable = email === '' || emailValidity !== '사용 가능한 이메일입니다!' || password === '' || isPasswordTypeValid === false || isConsecutiveValid === false || isSameAsEmail === false || confirmPassword === '' || confirmPasswordValidity !== '패스워드가 일치합니다' || name === '' || verificationCode === '' || verificationResult !== '인증 코드가 올바릅니다.';
    const isSignupButtonDisable = email === '';

    return (
        <>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={handleEmailChange} onBlur={handleEmailInputBlur} required/>
                {/*{emailValidity && <div*/}
                {/*    style={{color: `${emailValidity === "사용 가능한 이메일입니다!" ? 'green' : 'red'}`}}>{emailValidity}</div>}*/}
            </div>

            <div>
                <label>패스워드:</label>
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onClick={handleClickPasswordInput}
                />
                {isClickedPasswordInput && !isPasswordValid && (
                    <div className="password-guid-area">
                        <div className="password-guide-error"
                             style={{color: `${password.length === 0 ? 'gray' : (isPasswordTypeValid ? 'green' : 'red')}`}}>
                            영문/숫자/특수문자 2가지 이상 조합 (8~20자)이여야 합니다.
                        </div>
                        <div className="password-guide-error"
                             style={{color: `${password.length === 0 ? 'gray' : (isConsecutiveValid ? 'green' : 'red')}`}}>
                            3개 이상 연속되거나 동일한 문자/숫자는 사용할 수 없습니다.
                        </div>
                        <div className="password-guide-error"
                             style={{color: `${password.length === 0 ? 'gray' : (!isSameAsEmail ? 'green' : 'red')}`}}>
                            패스워드는 아이디(이메일)와 다르게 설정해야 합니다.
                        </div>
                    </div>
                )}
                {isPasswordValid && (
                    <span className="valid-message">
                        사용 가능한 비밀번호입니다!
                    </span>
                )}
            </div>


            <label>패스워드확인:</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordInputBlur}
                required
            />
            {confirmPasswordValidity && <div
                style={{color: `${confirmPasswordValidity === "패스워드가 일치합니다" ? 'green' : 'red'}`}}>{confirmPasswordValidity}</div>}

            <div>
                <label>이름:</label>
                <input type="text" value={name} onChange={handleNameChange} required/>
            </div>

            <div>
                <label>닉네임:</label>
                <input type="text" value={nickName} onChange={handleNickNameChange} required/>
            </div>

            <button type="submit" disabled={isSignupButtonDisable} onClick={signupUser}>회원가입</button>
        </>
    );
};

export default SignupPage;
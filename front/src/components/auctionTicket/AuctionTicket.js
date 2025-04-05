import React, {useState} from 'react';
import '../../css/components/Modal/BuyAuctionTicketModal.css';
import axios from "axios";
import { useSelector } from 'react-redux';
import {useNavigate} from "react-router-dom";
import {api, apii, authApi, portOneApi} from "../../api/axios";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

const AuctionTicket = () => {

    let token = localStorage.getItem('accessToken');
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // 로딩 상태 추가


    var IMP = window.IMP;
    IMP.init(process.env.REACT_APP_IMP);

    const handlePayment = async() => {

        // 사용자가 로그인하지 않았을 경우, 결제를 실행하지 않고 경고 메시지를 표시합니다.
        if (!token && !userInfo) {
            alert("로그인 후 이용 가능합니다.");
            // // "/login" 경로로 이동합니다.
            // navigate('/login');
            return;
        }

        setLoading(true);

        /* 결제 데이터 정의하기 */
        IMP.request_pay(
            {
            pg: "kakaopay",
            merchant_uid: `mid_${new Date().getTime()}`,
            amount: 10000,
            buyer_name: userInfo.nickName,
            name: "TimeAuction 경매권"
        }, async function (response) {
                const {success, imp_uid, merchant_uid, error_msg} = response;

                if (success) {
                    await api.post("/payment/verify", {
                        impUid     : imp_uid,
                        merchantUid: merchant_uid,
                    })
                        .then(async (result) => {
                            console.log(result)
                            if (result.data == true) {
                                alert("결제가 성공적으로 완료되었습니다! 홈으로 이동합니다");

                                // 유저 정보 요청
                                const userInfoResponse = await api.get('/auth/user/info');

                                // 유저 데이터를 로컬스토리지에 저장
                                localStorage.setItem('userInfo', JSON.stringify(userInfoResponse.data));
                                setLoading(false);
                                navigate('/')
                            } else {
                                alert(`결제 실패: ${result.message}`);
                                setLoading(false);
                            }
                        })
                        .catch((error) => {
                            alert(`결제 실패: ${error.message}`);
                            setLoading(false);
                        });
                } else {
                    setLoading(false);
                    alert(`결제 실패: ${error_msg}`);
                }
            }
        )
    };

    return (
        <div className="payment-container">
            {loading && <LoadingSpinner />}
            <img className="kakaopayImage" src="/images/kakaopay.jpg"/>
            <span className="payment-information">카카오페이 QR코드결제를 통해 경매권 결제를 진행할 수 있습니다.</span>
            <button className="paymentButton" onClick={handlePayment}>10초만에 결제하기</button>
        </div>
    );

}
export default AuctionTicket;
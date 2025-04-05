import React from 'react';
import { MdOutlineSell } from 'react-icons/md';
import { GoPencil } from 'react-icons/go';
import { HiOutlineTrash } from 'react-icons/hi';
import "../../../src/css/components/productDetail/ProductOverflowMenu.css";
import axios from 'axios';
import {api, noApi, productApi} from "../../api/axios";
import {useNavigate} from "react-router-dom";

const ProductOverflowMenu = ({ productId , product }) => {

    const navigate = useNavigate();

    const navigateEditForm = () => {
        navigate("/product/edit", { state: { product } });
    };

    const handleCompleteSale = async() => {
        const confirmComplete = window.confirm("판매를 종료하시겠습니까?");
        if (confirmComplete) {
            // API 호출
            await noApi.post(`/product/${productId}/completeSale`,{
            })
                .then(response => {
                    alert("판매가 종료되었습니다.");
                    navigate('/');
                })
                .catch(error => {
                    console.error("Error:", error.response.data.message);
                    alert(error.response.data.message);
                });
        }
    };

    return (
        <>
            <div className="product-update-btn" onClick={navigateEditForm}>
                <span>수정하기</span>
                <GoPencil />
            </div>
            <div className="product-finishSell-btn" onClick={handleCompleteSale}>
                <span>판매종료</span>
                <MdOutlineSell />
            </div>
        </>
    );
};

export default ProductOverflowMenu;

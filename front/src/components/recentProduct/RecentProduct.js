import React from 'react';
import '../../css/components/recentProduct/RecentProduct.css';
import {Link} from "react-router-dom";


const RecentProduct = ({recentProduct}) => {

    // 이미지 URL에 encodeURIComponent() 함수를 적용하여 인코딩
    // const thumbnailImageUrl = `/images/${encodeURIComponent(recentProduct.productImageUrl.split("\\").pop())}`;
    // const sellerIconImageUrl = `/userIcon/${recentProduct.sellerIconUrl.split("\\").pop()}`;

    // 현재 판매 중인 상품인지 판단
    const productSaleStatus = recentProduct.productSaleStatus;

    function getFirstImageUrl(description) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');
        const imageElements = doc.querySelectorAll('img');

        if (imageElements.length > 0) {
            return imageElements[0].src;
        } else {
            return null;
        }
    }

    function getImageCount(description) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');
        const imageElements = doc.querySelectorAll('img');
        return imageElements.length;
    }

    function getDescriptionText(description) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(description, 'text/html');
        const paragraphs = doc.querySelectorAll('p');
        let descriptionText = '';

        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            if (!paragraph.querySelector('img')) {
                descriptionText += paragraph.textContent.trim() + '\n';
            }
        }

        return descriptionText.trim();
    }

    return (
        <div id="product-block">
            <Link to={`/product/${recentProduct.id}`}>
                <div className="product">
                    <div className="product-detail-block">
                        <div className="product-image-container">
                            <img
                                src={`https://timeauction-productthumbnail-wjavmtngkr12.s3.ap-northeast-2.amazonaws.com/` + `${recentProduct.thumbNailUrl}`}
                                className={`product-thumbnail ${productSaleStatus==="AVAILABLE" ? '' : 'sold'}`}
                                alt="Thumbnail"
                            />
                            {productSaleStatus==="SOLD" && (<div className="sold-overlay">
                                <span>판매 완료</span>
                            </div>)}
                        </div>
                        <div className="product-title-description-block">
                            <div className="product-title">
                                <span dangerouslySetInnerHTML={{__html: recentProduct.productTitle}}/>
                            </div>
                            <div className="product-description">
                                <span>{getDescriptionText(recentProduct.productDescription)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="product-metadata">
                        <div className="product-price-block">
                            시간당 :
                            <span className="product-price"> {recentProduct.productPrice}</span>
                            <span>원</span>
                        </div>
                        <span className="seller-Info">
                        <span className="seller-nickName">판매자 {recentProduct.sellerNickName}</span>
                        </span>
                    </div>
                </div>
            </Link>
        </div>

    );
};

export default RecentProduct;
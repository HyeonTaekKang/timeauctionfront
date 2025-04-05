import {useNavigate} from "react-router-dom";
import '../../css/components/selectTimeSellingType/SelectTimeSellingType.css';

const SelectTimeSellingType = () => {
    const navigate = useNavigate();

    const handleAuctionClick = () => {
        navigate('/new/auction');
    };

    const handleProductClick = () => {
        navigate('/new/product');
    };

    return (
        <div className="sell-time-page-container">
            <h1 className="sell-time-page-title">판매 타입을 결정해주세요</h1>
            <div className="sell-type-button-container">
                <div className="sell-type-button" onClick={handleAuctionClick}>
                    <h2>경매</h2>
                </div>
                <div className="sell-type-button" onClick={handleProductClick}>
                    <h2>일반 판매</h2>
                </div>
            </div>
        </div>
    );
};

export default SelectTimeSellingType;
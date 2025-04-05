import React, {useState} from 'react';
import '../../css/components/selectAuctionDurationButtons/SelectAuctionDurationButtons.css';

const SelectAuctionDurationButtons = ({ setDuration }) => {
    const [selectedButton, setSelectedButton] = React.useState(null);

    const handleDurationClick = (duration) => {
        setSelectedButton(duration);
        setDuration(duration);
    };

    return (
        <div className="duration-buttons">
            <button
                type="button"
                className={`form-button ${selectedButton === 2 ? 'selected' : ''}`}
                onClick={() => handleDurationClick(2)}
            >
                2분
            </button>
            <button
                type="button"
                className={`form-button ${selectedButton === 3 ? 'selected' : ''}`}
                onClick={() => handleDurationClick(3)}
            >
                3일
            </button>
            <button
                type="button"
                className={`form-button ${selectedButton === 6 ? 'selected' : ''}`}
                onClick={() => handleDurationClick(6)}
            >
                6일
            </button>
            <button
                type="button"
                className={`form-button ${selectedButton === 9 ? 'selected' : ''}`}
                onClick={() => handleDurationClick(9)}
            >
                9일
            </button>
            <br />
        </div>
    );
};

export default SelectAuctionDurationButtons;
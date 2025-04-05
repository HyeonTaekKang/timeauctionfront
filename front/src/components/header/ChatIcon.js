import React, {useState} from 'react';
import "../../css/components/header/TooltipIcon.css"
import ProductChatRoom from "../chat/chatRoom/ProductChatRoom";

const ChatIcon = ({ IconComponent, tooltipText , onClick , countUnReadMessages }) => {

    return (
        <div className="tooltip-container" onClick={onClick}>
            <IconComponent size={18}/>
            {countUnReadMessages > 0 && <span className="unReadMessage-count">{countUnReadMessages}</span>}
            <span className="tooltip-text">{tooltipText}</span>
        </div>
    );
};

export default ChatIcon;
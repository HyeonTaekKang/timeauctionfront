import React from 'react';

const NotificationIcon = ({ IconComponent, tooltipText}) => {
    return (
        <div className="tooltip-container">
            <IconComponent size={18}/>
            <span className="tooltip-text">{tooltipText}</span>
        </div>
    );
};

export default NotificationIcon;
import React, {useState} from 'react';
import AuctionTicketInfoDropDown from "./AuctionTicketInfoDropDown";

const AuctionTicketIcon = ({ IconComponent, ticketData}) => {
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div className={"tooltip-container"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <IconComponent size={18}/>
            {isHovering && (
                <div id="userAuctionTicketInfo-dropDown">
                    <AuctionTicketInfoDropDown
                        ticketData={{ startDateTime: ticketData.startDateTime, endDateTime: ticketData.endDateTime }}
                    />
                </div>
            )}
        </div>
    );
};

export default AuctionTicketIcon;
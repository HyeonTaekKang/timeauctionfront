import '../../css/components/sideNavigation/SideNavigation.css';
import {AiFillHome, AiOutlineHeart} from "react-icons/ai";
import {IoPeopleOutline, IoTicketOutline} from "react-icons/io5";
import {MdOutlineAssignmentLate} from "react-icons/md";
import React, {useState} from "react";
import AuctionTicket from "../auctionTicket/AuctionTicket";
import {Link} from "react-router-dom";

const SideNavigation = () => {

    return (
        <aside className="side-navigation-container">
            <div className="items">
                <div className="item">
                    <a className="endpoint" href="/">
                        <AiFillHome className="icon" size="20"></AiFillHome>
                        홈
                    </a>
                </div>

                <div className="item">
                    <a className="endpoint" href="#">
                        <MdOutlineAssignmentLate className="icon" size="20"></MdOutlineAssignmentLate>
                        내 경매
                    </a>
                </div>

                <div className="item">
                    <a className="endpoint" href="/community">
                        <IoPeopleOutline className="icon" size="20"></IoPeopleOutline>
                        커뮤니티
                    </a>
                </div>

                <Link to={'/purchase/auctionTicket'}>
                    <div className="item">
                        <div className="endpoint">
                            <IoTicketOutline className="icon" size="20"></IoTicketOutline>
                            경매권
                        </div>
                    </div>
                </Link>


                <div className="item">
                    <a className="endpoint" href="#">
                        <AiOutlineHeart className="icon" size="20"></AiOutlineHeart>
                        관심경매
                    </a>
                </div>

            </div>
        </aside>

    );
};

export default SideNavigation;
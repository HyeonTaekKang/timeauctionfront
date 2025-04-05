import '../../css/components/mainContainer/MainContainer.css';
import RecentAuctionList from "../recentAuction/RecentAuctionList";
import SideNavigation from "../sideNavigation/SideNavigation";
import {useSelector} from "react-redux";
import RecentPostList from "../recentPost/RecentPostList";
import RecentProduct from "../recentProduct/RecentProduct";
import RecentProductList from "../recentProduct/RecentProductList";


const MainContainer = () => {

    let sideNavigationState = useSelector((state)=> state.sideNavigationState)

    return(
        <main className="main-container">
            {sideNavigationState ? <SideNavigation /> : null}
            <article className="main-content">
                <RecentAuctionList></RecentAuctionList>
                <RecentPostList></RecentPostList>
                <RecentProductList></RecentProductList>
            </article>
        </main>
    )
}

export default MainContainer;
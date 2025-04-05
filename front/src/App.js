import './App.css';
import {Route, Routes, useNavigate} from "react-router-dom";
import CreateAuctionPage from "./pages/createAuctionPage/CreateAuctionPage";
import LoginPage from "./pages/auth/LoginPage";
import MainPage from "./pages/main/MainPage";
import AuctionDetailPage from "./pages/auctionDetailPage/AuctionDetailPage";
import PurchaseAuctionTicketPage from "./pages/purchaseAuctionTicket/PurchaseAuctionTicketPage";
import ProductDetailPage from "./pages/productDetailPage/ProductDetailPage";
import {useDispatch, useSelector} from "react-redux";
import AuctionListPage from "./pages/auctionListPage/AuctionListPage";
import LoginSuccess from "./components/auth/login/LoginSuccess";
import AuctionWatingPage from "./pages/auctionWatingPage/AuctionWatingPage";
import AuctionBidPage from "./pages/auctionBidPage/AuctionBidPage";
import SelectTimeSellingType from "./pages/selectTimeSellingType/SelectTimeSellingType";
import CreateProductPage from "./pages/createProductPage/CreateProductPage";
import ProductListPage from "./pages/productListPage/ProductListPage";
import PostListPage from "./pages/postListPage/PostListPage";
import CreatePostPage from "./pages/createPostPage/CreatePostPage";
import PostDetailPage from "./pages/postDetailPage/PostDetailPage";
import SearchResultPage from "./pages/searchResultPage/SearchResultPage";
import SignUpForm from "./components/auth/signup/SignUpForm";
import MySellPage from "./pages/mySellPage/MySellPage";
import EditProductPage from "./pages/editProductPage/EditProductPage";
import EditPostPage from "./pages/editPostPage/EditPostPage";

function App() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isUserLoggedIn = useSelector((state) => state.userLoginState)


    // useEffect(() => {
    //     // 세션 만료 확인을 위한 메서드
    //     // 일정주기 동안 서버에 요청을 계속 보내면서 세션이 만료되었는지를 확인합니다.
    //     // 세션이 만료되었다면 자동으로 로그아웃처리를 합니다.
    //     const checkSession = () => {
    //         if (isUserLoggedIn) {
    //             axios.get('/session_check', { withCredentials: true })
    //                 .then(response => {
    //                     if (!response.data.sessionActive) {
    //                         dispatch(isUserLogout());
    //                         dispatch(deleteLoginUserData());
    //                         alert('세션이 만료되었습니다. 다시 로그인해주세요.');
    //                         navigate('/')
    //                     }
    //                 })
    //                 .catch(error => {
    //                     console.error('세션 확인 요청 중 오류가 발생했습니다: ', error);
    //                     navigate('/')
    //                 });
    //         }
    //     };
    //
    //     // 페이지가 다시 보일 때 세션 체크를 수행합니다.
    //     const handleVisibilityChange = () => {
    //         if (!document.hidden) {
    //             checkSession();
    //         }
    //     };
    //
    //     // visibilitychagne = 웹 페이지 복귀 탐지 , visibilitychange 이벤트를 등록합니다.
    //     document.addEventListener('visibilitychange', handleVisibilityChange);
    //
    //     // // 일정주기 동안 서버에 요청을 계속 보내면서 세션이 만료되었는지를 확인합니다.
    //     // const interval = setInterval(checkSession, 60000);  // 1분마다 세션 상태를 확인
    //     //
    //     // return () => {
    //     //     // 컴포넌트가 unmount될 때 이벤트를 해제하고 interval을 clear합니다.
    //     //     document.removeEventListener('visibilitychange', handleVisibilityChange);
    //     //     clearInterval(interval);
    //     // };
    // }, [isUserLoggedIn]);  // 로그인 상태가 변경될 때마다 useEffect를 재실행합니다.
    //
    // const location = useLocation();
    // // 해당 url에서는 <header> 컴포넌트를 숨김
    // const hideHeader = location.pathname.startsWith('/signup')|| location.pathname.startsWith('/login');

    return (
        <div className="App">
            <>
                <Routes>

                    {/*mySell*/}
                    <Route path="/mySell" element={<MySellPage/>}/>

                    {/*auth*/}
                    <Route path="/login-success" element={<LoginSuccess/>}/>
                    <Route path="/" element={<MainPage/>}></Route>
                    <Route path="/login" element={<LoginPage/>}></Route>
                    <Route path="/signup" element={<SignUpForm/>}></Route>

                    <Route path="/search" element={<SearchResultPage/>}></Route>

                    {/*auction*/}
                    <Route path="/new/auction" element={<CreateAuctionPage/>}></Route>
                    <Route path="/auctions" element={<AuctionListPage/>}></Route>
                    <Route path="/auction/:auctionId" element={<AuctionDetailPage/>}></Route>
                    <Route path="/auctionBid/:auctionId" element={<AuctionBidPage/>}></Route>
                    <Route path="/auctionWaiting/:auctionId" element={<AuctionWatingPage/>}></Route>

                    {/*product*/}
                    <Route path="/new/product" element={<CreateProductPage/>}></Route>
                    <Route path="/products" element={<ProductListPage/>}></Route>
                    <Route path="/product/:productId" element={<ProductDetailPage/>}></Route>
                    <Route path="/product/edit" element={<EditProductPage/>}></Route>

                    {/*post*/}
                    <Route path="/new/post" element={<CreatePostPage/>}></Route>
                    <Route path="/posts" element={<PostListPage/>}></Route>
                    <Route path="/post/:postId" element={<PostDetailPage/>}></Route>
                    <Route path="/post/edit" element={<EditPostPage/>}></Route>

                    {/*util*/}
                    <Route path="/purchase/auctionTicket" element={<PurchaseAuctionTicketPage/>}></Route>
                    <Route path="/select/sellingType" element={<SelectTimeSellingType/>}></Route>

                </Routes>
            </>
        </div>
    )

}

export default App;

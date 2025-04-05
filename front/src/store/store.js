import {combineReducers, configureStore, createSlice} from '@reduxjs/toolkit'

const unReadMessageCount = createSlice({
    name        : 'unReadMessageCount',
    initialState: 0,
    reducers    : {
        setUnReadMessageCount: (state, action) => {
            return action.payload; // 서버에서 받아온 경매 정보로 상태를 업데이트합니다.
        },
        decrementUnReadMessageCount: (state, action) => {
            return state - action.payload; // 읽은 메시지 수만큼 감소
        },
        increaseUnReadMessageCount: (state) => {
            return state + 1; // 상태를 1 증가
        },
    },
})

const recentAuctionList = createSlice({
    name        : 'recentAuctionList',
    initialState: [],
    reducers    : {
        setRecentAuctionList: (state, action) => {
            return action.payload; // 서버에서 받아온 경매 정보로 상태를 업데이트합니다.
        },
    },
})

const recentPostList = createSlice({
    name        : 'recentPostList',
    initialState: [],
    reducers    : {
        setRecentPostList: (state, action) => {
            return action.payload; // 서버에서 받아온 경매 정보로 상태를 업데이트합니다.
        },
    },
})

const userLoginState = createSlice({
    name        : 'userLoginState',
    initialState: false,
    reducers    : {
        isUserLogin() {
            return true
        },
        isUserLogout() {
            return false
        }
    }
})

const loginUserData = createSlice({
    name        : 'loginUserData',
    initialState: null,
    reducers    : {
        setLoginUserData(state, userData) {
            return userData.payload
        },

        deleteLoginUserData() {
            return null
        }
    }
})

// SideNavigation 컴포넌트 상태관리
const sideNavigationState = createSlice({
    name        : 'sideNavigationState',
    initialState: false,
    reducers    : {
        setSideNavigationState(state) {
            return !state;
        }
    }
})

const userAccessToken = createSlice({
    name        : 'userAccessToken',
    initialState: null,
    reducers    : {
        setAccessToken(state, action) {
            return action.payload;
        },
    },
});


export const {setUnReadMessageCount, decrementUnReadMessageCount, increaseUnReadMessageCount} = unReadMessageCount.actions
export const {setRecentAuctionList} = recentAuctionList.actions
export const {setRecentPostList} = recentPostList.actions
export const {isUserLogin, isUserLogout} = userLoginState.actions

export const {setAccessToken} = userAccessToken.actions;

export const {setLoginUserData, deleteLoginUserData} = loginUserData.actions
export const {setSideNavigationState} = sideNavigationState.actions


const rootReducer = combineReducers({
    unReadMessageCount: unReadMessageCount.reducer,
    recentAuctionList: recentAuctionList.reducer,
    recentPostList   : recentPostList.reducer,
    userLoginState   : userLoginState.reducer,
    // loginUserData: persistedLoginUserDataReducer,
    sideNavigationState: sideNavigationState.reducer,
    // authReducer를 여기에 추가합니다.
    userAccessToken: userAccessToken.reducer,
});

export const store = configureStore({
    reducer   : rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
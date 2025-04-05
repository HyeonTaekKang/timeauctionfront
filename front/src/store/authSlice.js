// // src/store/authSlice.js
// import { createSlice } from '@reduxjs/toolkit';
//
// const initialState = {
//     accessToken: null,
// };
//
// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         setAccessToken: (state, action) => {
//             state.accessToken = action.payload;
//         },
//     },
// });
//
// // 액션 생성자들을 named export로 설정합니다.
// export const { setAccessToken } = authSlice.actions;
//
// // reducer를 default export로 설정합니다.
// export default authSlice.reducer;
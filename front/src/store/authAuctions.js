//
//
// // 이 파일은 Redux의 dispatch 함수를 인자로 받아 액세스 토큰을 업데이트하는 함수를 포함합니다.
//
// import { setAccessToken } from './authSlice';
//
// // 새로운 액세스 토큰을 받아와서 저장하는 함수
// export async function updateAccessToken(dispatch) {
//     try {
//         const newAccessToken = await refreshAccessToken(); // 새로운 액세스 토큰을 받아오는 함수, 구현 필요
//         dispatch(setAccessToken(newAccessToken));
//         return newAccessToken;
//     } catch (error) {
//         console.error('액세스 토큰 새로고침 실패:', error);
//         throw error;
//     }
// }
//

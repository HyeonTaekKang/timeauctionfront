import axios from 'axios';

//---------------------------------------------------------------------------------------------------------------------------------------

// auction ( 토큰 필요 )
const auctionApi = axios.create({
    baseURL: 'https://api.timeauction.net/auction'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

// auction ( 토큰 X )
const noTokenAuctionApi = axios.create({
    baseURL: 'https://api.timeauction.net/auction'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

auctionApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

auctionApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

//---------------------------------------------------------------------------------------------------------------------------------------

// product ( 토큰 필요 )
const productApi = axios.create({
    baseURL: 'https://l5g8z0h1ld.execute-api.ap-northeast-2.amazonaws.com/prod'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

// product ( 토큰 X )
const noTokenProductApi = axios.create({
    baseURL: 'https://timeauction.net/product'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

productApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

productApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);


//---------------------------------------------------------------------------------------------------------------------------------------

// post ( 토큰 필요 )
const postApi = axios.create({
    baseURL: 'https://timeauction.net/post'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

// post ( 토큰 X )
const noTokenPostApi = axios.create({
    baseURL: 'https://timeauction.net/post'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

postApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

postApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

//---------------------------------------------------------------------------------------------------------------------------------------

// auth ( 토큰 필요 )
const authApi = axios.create({
    baseURL: 'https://api.timeauction.net/auth'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

// auth ( 토큰 X )
const noTokenAuthApi = axios.create({
    baseURL: 'https://api.timeauction.net/auth'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

authApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        console.log('Access Token:', token); // 여기에 추가
        console.log('Request Headers Before:', config.headers); // 헤더 확인

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('Request Headers After:', config.headers); // 헤더 확인
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

authApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

// 액세스 토큰 갱신 함수
async function refreshAccessToken() {
    try {
        const loginUserData = JSON.parse(localStorage.getItem('userInfo')); // JSON으로 파싱
        const response = await noTokenAuthApi.post('/jwt/refreshAccessToken', {userId:loginUserData.id}, { withCredentials: true });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken)
    } catch (err) {
        console.error('Failed to refresh access token:', err);
        throw err;
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------

// chat ( 토큰 필요 )
const chatApi = axios.create({
    baseURL: 'https://chat.timeauction.net'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

// chat ( 토큰 X )
const noTokenChatApi = axios.create({
    baseURL: 'https://chat.timeauction.net'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

chatApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

chatApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401 || error.response.status === 400)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

//---------------------------------------------------------------------------------------------------------------------------------------

// portone ( 토큰 필요 )
const portOneApi = axios.create({
    baseURL: 'https://l4iz6ni5sg.execute-api.ap-northeast-2.amazonaws.com/prod'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

portOneApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        console.log('Access Token:', token); // 여기에 추가
        console.log('Request Headers Before:', config.headers); // 헤더 확인

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('Request Headers After:', config.headers); // 헤더 확인
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

portOneApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

//---------------------------------------------------------------------------------------------------------------------------------------

// auctionBid ( 토큰 필요 )
const auctionBidApi = axios.create({
    baseURL: 'https://ge2hzvoztg.execute-api.ap-northeast-2.amazonaws.com/prod'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

// auctionBid ( 토큰 필요 )
const noTokenAuctionBidApi = axios.create({
    baseURL: 'https://ge2hzvoztg.execute-api.ap-northeast-2.amazonaws.com/prod'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

auctionBidApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        console.log('Access Token:', token); // 여기에 추가
        console.log('Request Headers Before:', config.headers); // 헤더 확인

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('Request Headers After:', config.headers); // 헤더 확인
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

auctionBidApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);




//---------------------------------------------------------------------------------------------------------------------------------------



// 대기열 api
const webfluxApi = axios.create({
    baseURL: 'https://omcje3rxh1.execute-api.ap-northeast-2.amazonaws.com/prod'
});

webfluxApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

webfluxApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

//---------------------------------------------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------------------------------------------







//---------------------------------------------------------------------------------------------------------------------------------------


// accessToken 필요 api
const api = axios.create({
    baseURL: 'https://api.timeauction.net'
});

// accessToken 필요X api
const noApi = axios.create({
    baseURL: 'https://api.timeauction.net'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401) || (error.response.status === 400)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);


//---------------------------------------------------------------------------------------------------------------------------------------

// accessToken 필요 api
const apii = axios.create({
    baseURL: 'http://localhost:9000'
});

// accessToken 필요X api
const noApii = axios.create({
    baseURL: 'http://localhost:9000'
    // 필요에 따라 추가 설정을 할 수 있습니다.
});

apii.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apii.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response) {
            if ((error.response.status === 401)){
                originalRequest._retry = true;
                try {
                    const newAccessToken = await refreshAccessToken();
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh access token:', err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('userInfo');
                    alert("로그아웃 처리되었습니다.");

                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                    return Promise.reject(err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export {
    auctionApi , noTokenAuctionApi,
    productApi , noTokenProductApi ,
    postApi , noTokenPostApi ,
    authApi , noTokenAuthApi ,
    chatApi , noTokenChatApi,
    portOneApi,
    auctionBidApi, noTokenAuctionBidApi,
    webfluxApi,
    noApi , api,
    noApii , apii,
};
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // 쿠키 라이브러리
import {AiOutlineClose, AiOutlineSearch} from "react-icons/ai";
import '../../../src/css/components/search/FullScreenSearch.css'
import {IoClose} from "react-icons/io5";
import {GoClock} from "react-icons/go";

const FullScreenSearch = ({ setIsFullScreen }) => {
    const [keyword, setKeyword] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const navigate = useNavigate();

    // 컴포넌트가 마운트될 때 쿠키에서 검색어를 불러옴
    useEffect(() => {
        const savedHistory = Cookies.get('searchHistory');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && keyword) {
            performSearch(keyword);
        }
    };

    const performSearch = (searchTerm) => {
        const updatedHistory = [...new Set([searchTerm, ...searchHistory])]; // 중복 제거
        setSearchHistory(updatedHistory);
        Cookies.set('searchHistory', JSON.stringify(updatedHistory), { expires: 7 }); // 쿠키에 저장 (7일 유효)
        navigate(`/search?keyword=${searchTerm}`);
        setKeyword(''); // 검색 후 입력창 초기화
    };

    const handleCancel = () => {
        setIsFullScreen(false); // 전체 화면 검색 모드 종료
        setKeyword(''); // 검색어 초기화
    };

    const clearHistory = () => {
        setSearchHistory([]); // 모든 검색어 삭제
        Cookies.remove('searchHistory'); // 쿠키 삭제
    };

    const removeKeyword = (keywordToRemove) => {
        const updatedHistory = searchHistory.filter((k) => k !== keywordToRemove);
        setSearchHistory(updatedHistory);
        Cookies.set('searchHistory', JSON.stringify(updatedHistory), { expires: 7 }); // 쿠키 업데이트
    };

    const handleHistoryClick = (searchTerm) => {
        performSearch(searchTerm); // 클릭한 검색어로 검색 수행
    };

    return (
        <div className="full-screen-search-container">
            <div className="full-screen-search-block">
                <input
                    type="text"
                    className="full-screen-search-input"
                    placeholder="검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <IoClose onClick={handleCancel} size={30}/>
            </div>

            <div className="search-history">
                {searchHistory.length > 0 ? (
                    <>
                        <div className="full-screen-search-history-header">
                            <span className="recent-search-font">최근 검색어</span>
                            <button className="clear-all" onClick={clearHistory}>전체삭제</button>
                        </div>
                        <div>
                            {searchHistory.map((item) => (
                                <div key={item} className="history-item" onClick={() => handleHistoryClick(item)}>
                                    <div className="full-screen-search-history-item">
                                        <GoClock size="17" color="gray"/>{item}
                                    </div>
                                    <AiOutlineClose
                                        className="close-icon"
                                        onClick={(e) => {
                                            e.stopPropagation(); // 클릭 이벤트 전파 방지
                                            removeKeyword(item);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-history">
                        최근 검색 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullScreenSearch;

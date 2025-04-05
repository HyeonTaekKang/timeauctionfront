import React, {useState} from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import '../../css/components/search/SearchBar.css';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SearchBar = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            // 검색어가 입력되면 SearchResult로 리디렉션
            navigate(`/search?keyword=${keyword}`);
        }
    };

    return (
        <>
            <div className="search-container">
                <AiOutlineSearch size={17} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
        </>
    );
};

export default SearchBar;
import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import '../../css/components/search/SearchResult.css';
import {noApi} from "../../api/axios";
import {ClipLoader} from 'react-spinners';

const SearchResult = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const getQueryParam = (key) => {
        return new URLSearchParams(location.search).get(key);
    };

    useEffect(() => {
        const keyword = getQueryParam('keyword');
        if (keyword) {
            const fetchData = async () => {
                setLoading(true); // 로딩 시작
                try {
                    const response = await noApi.get(`/search?keyword=${keyword}`);
                    setResults(response.data);
                } catch (error) {
                    console.error('Search API error:', error);
                } finally {
                    setLoading(false); // 로딩 완료
                }
            };
            fetchData();
        } else {
            setLoading(false); // 키워드가 없을 경우 로딩 종료
        }
    }, [location]);

    const stripHtml = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    return (
        <div className="results-container">
            {loading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <ClipLoader color="#ff55aa" loading={loading} size={15}/>
                </div> // 로딩 중일 때 로딩 스피너 표시
            ) : (
                results.length > 0 && (
                    <>
                        <h2 className="search-headline">Auction 검색 결과</h2>
                        <div className="grid">
                            {results.filter(result => result.type === 'auction').map(result => (
                                <div key={result.id} className="grid-item">
                                    <a href={`/auction/${result.id}`} className="result-link">
                                        <h3 className="search-title">{stripHtml(result.title)}</h3>
                                        <div className="search-content">{stripHtml(result.content)}</div>
                                    </a>
                                </div>
                            ))}
                        </div>

                        <h2 className="search-headline">Product 검색 결과</h2>
                        <div className="grid">
                            {results.filter(result => result.type === 'product').map(result => (
                                <div key={result.id} className="grid-item">
                                    <a href={`/product/${result.id}`} className="result-link">
                                        <h3 className="search-title">{stripHtml(result.title)}</h3>
                                        <p className="search-content">{stripHtml(result.content)}</p>
                                    </a>
                                </div>
                            ))}
                        </div>

                        <h2 className="search-headline">Post 검색 결과</h2>
                        <div className="grid">
                            {results.filter(result => result.type === 'post').map(result => (
                                <div key={result.id} className="grid-item">
                                    <a href={`/post/${result.id}`} className="result-link">
                                        <h3 className="search-title">{stripHtml(result.title)}</h3>
                                        <p className="search-content">{stripHtml(result.content)}</p>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default SearchResult;

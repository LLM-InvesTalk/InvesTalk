import React, { useState, useEffect } from 'react';
import styles from './NewsComponentStyle.module.css';  // 모듈화된 CSS

const NewsComponent = () => {
    const [news, setNews] = useState([]);
    const API_URL = process.env.REACT_APP_FLASK_API_URL;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`${API_URL}/api/get-news`);  // 백엔드 API 경로
                const data = await response.json();
                
                // 상위 3개의 뉴스만 선택
                const top3News = data.slice(0, 3);

                setNews(top3News.map((article) => ({
                    title: article.title || "제목 없음",
                    time: new Date(article.published_time).toLocaleString(),  // UNIX timestamp 변환
                    imgSrc: article.thumbnail || "https://via.placeholder.com/150",  // 이미지가 없을 경우 기본 이미지
                    link: article.link  // 뉴스 링크
                })));
            } catch (error) {
                console.error('뉴스 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchNews();  // useEffect 안에서 뉴스 데이터를 가져오는 함수 실행
    }, [API_URL]);

    return (
        <div className={styles['div-wrapper']}>
            <div className={styles['group-14']}>
                <div className={styles['group-15']}>
                    <div className={styles['text-wrapper-13']}>News</div>
                    <div className={styles['frame-2']}>
                        {news.map((article, index) => (
                            <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles['news-item']} key={index}>
                                <div className={styles['group-16']}>
                                    <img src={article.imgSrc} alt={article.title} className={styles['news-thumbnail']} />
                                    <div className={styles['news-content']}>
                                        <div className={styles['text-wrapper-14']}>
                                            {article.title.length > 10 ? `${article.title.substring(0, 20)}...` : article.title}
                                        </div>
                                        <div className={styles['text-wrapper-15']}>
                                            {article.time}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsComponent;

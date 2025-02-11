import React, { useState, useEffect } from 'react';
import styles from './NewsComponentStyle.module.css';  // 모듈화된 CSS
import ButtonComponent from './Button/ButtonComponent';
import LeftButtonComponent from './Button/LeftButtonComponent';
import LoadingAnimation from '../../loading/LoadingAnimation';

const NewsComponent = () => {
    const [news, setNews] = useState([]);
    const [offset, setOffset] = useState(0); // 현재 offset
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const FLASK_URL = process.env.REACT_APP_FLASK_URL;

    const fetchNews = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${FLASK_URL}/api/get-news?offset=${offset}&limit=3`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setNews(data);
        } catch (error) {
            console.error('뉴스 데이터를 가져오는 중 오류 발생:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [offset]);

    const handleNext = () => {
        setOffset((prevOffset) => prevOffset + 3); // 3개씩 이동
    };

    const handlePrev = () => {
        setOffset((prevOffset) => Math.max(prevOffset - 3, 0)); // 3개씩 이동, 최소 0
    };

    return (
        <div className={styles['div-wrapper']}>
            <div className={styles['group-14']}>
                <div className={styles['group-15']}>
                    <div className={styles['text-wrapper-13']}>News</div>
                    {isLoading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '230px', // 전체 컴포넌트 높이 지정
                        }}>
                            <LoadingAnimation />
                        </div>
                    ) : (
                        <div className={styles['frame-2']}>
                            {news.map((article, index) => (
                                <div className={styles['news-item']} key={index}>
                                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                                        <div className={styles['group-16']}>
                                            <img src={article.imgSrc} alt={article.title} className={styles['news-thumbnail']} />
                                            <div className={styles['news-content']}>
                                                <div className={styles['text-wrapper-14']}>
                                                    {article.title.length > 20 ? `${article.title.substring(0, 20)}...` : article.title}
                                                </div>
                                                <div className={styles['text-wrapper-15']}>
                                                    {article.time}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* 왼쪽 및 오른쪽 버튼 컴포넌트 */}
                <LeftButtonComponent onClick={handlePrev} />
                <ButtonComponent onClick={handleNext} />
            </div>
        </div>
    );
};

export default NewsComponent;

import React, { useState, useEffect } from 'react';
import './NewsComponentStyle.css';
import './css/globals.css';
import './css/styleguide.css';

const NewsComponent = () => {
    const [news, setNews] = useState([
        {
            title: "Image Title",
            time: "00 minute ago",
            imgSrc: "https://c.animaapp.com/EtEiTaGN/img/image-83@2x.png",
        },
        {
            title: "Image Title",
            time: "00 minute ago",
            imgSrc: "https://c.animaapp.com/EtEiTaGN/img/image-84@2x.png",
        },
        {
            title: "Image Title",
            time: "00 minute ago",
            imgSrc: "https://c.animaapp.com/EtEiTaGN/img/image-85@2x.png",
        },
    ]);

    useEffect(() => {
        // 뉴스 1 데이터를 fetch
        const fetchNews1 = async () => {
            try {
                const response = await fetch('https://api.example.com/news1'); // 실제 API URL로 변경
                const data = await response.json();
                setNews(prevNews => [
                    {
                        title: data.title || "Image Title",
                        time: new Date(data.publishedAt).toLocaleString() || "00 minute ago",
                        imgSrc: data.urlToImage || "https://c.animaapp.com/EtEiTaGN/img/image-83@2x.png",
                    },
                    ...prevNews.slice(1),
                ]);
            } catch (error) {
                console.error('뉴스 1 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        // 뉴스 2 데이터를 fetch
        const fetchNews2 = async () => {
            try {
                const response = await fetch('https://api.example.com/news2'); // 실제 API URL로 변경
                const data = await response.json();
                setNews(prevNews => [
                    prevNews[0],
                    {
                        title: data.title || "Image Title",
                        time: new Date(data.publishedAt).toLocaleString() || "00 minute ago",
                        imgSrc: data.urlToImage || "https://c.animaapp.com/EtEiTaGN/img/image-84@2x.png",
                    },
                    prevNews[2],
                ]);
            } catch (error) {
                console.error('뉴스 2 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        // 뉴스 3 데이터를 fetch
        const fetchNews3 = async () => {
            try {
                const response = await fetch('https://api.example.com/news3'); // 실제 API URL로 변경
                const data = await response.json();
                setNews(prevNews => [
                    ...prevNews.slice(0, 2),
                    {
                        title: data.title || "Image Title",
                        time: new Date(data.publishedAt).toLocaleString() || "00 minute ago",
                        imgSrc: data.urlToImage || "https://c.animaapp.com/EtEiTaGN/img/image-85@2x.png",
                    },
                ]);
            } catch (error) {
                console.error('뉴스 3 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        // 각각의 뉴스를 비동기로 호출
        fetchNews1();
        fetchNews2();
        fetchNews3();
    }, []);

    return (
        <div className="group-14">
            <div className="group-15">
                <div className="text-wrapper-13">News</div>
                <div className="frame-2">
                    {news.map((article, index) => (
                        <div className="group-16" key={index}>
                            <div className={`overlap-${index+1}`}>
                                <div className="group-17">
                                    <div className="text-wrapper-14">{article.title}</div>
                                    <div className="text-wrapper-15">{article.time}</div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default NewsComponent;

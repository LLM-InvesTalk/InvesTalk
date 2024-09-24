import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./NewsRecommend.module.css"; // CSS Module import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import SectorRecommend from "./SectorRecommend"; // SectorRecommend 컴포넌트 import
import EnterpriseRecommend from "./EnterpriseRecommend"; // EnterpriseRecommend 컴포넌트 import
import ButtonComponent from "./Button/ButtonComponent"; // 오른쪽 버튼 컴포넌트 import
import LeftButtonComponent from "./Button/LeftButtonComponent"; // 왼쪽 버튼 컴포넌트 import 추가

const NewsRecommend = () => {
  const [isSector, setIsSector] = useState(false);
  const [isEnterprise, setIsEnterprise] = useState(false); // EnterpriseRecommend 전환 상태 추가
  const [newsData, setNewsData] = useState([]); // 뉴스 데이터를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 뉴스 데이터를 가져오는 함수
  const fetchNewsData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_FLASK_API_URL}/api/recommend-news?ticker=NVDA`
      );
      setNewsData(response.data); // 가져온 데이터를 상태에 저장
      setLoading(false); // 로딩 완료
    } catch (error) {
      console.error("뉴스 데이터를 가져오는 데 실패했습니다.", error);
      setError("뉴스 데이터를 가져오는 데 실패했습니다.");
      setLoading(false); // 에러 발생 시 로딩 중지
    }
  };

  // 컴포넌트가 처음 렌더링될 때 뉴스 데이터를 가져옴
  useEffect(() => {
    fetchNewsData();
  }, []);

  // SectorRecommend로 전환하는 함수
  const handleSwitchToSector = () => {
    setIsSector(true);
  };

  // EnterpriseRecommend로 전환하는 함수 (왼쪽 버튼 클릭 시)
  const handleSwitchToEnterprise = () => {
    setIsEnterprise(true);
  };

  // 제목을 80자 제한으로 자르고 '...' 추가하는 함수
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // 현재 상태에 따라 렌더링할 컴포넌트 결정
  if (isSector) {
    return <SectorRecommend />;
  }

  if (isEnterprise) {
    return <EnterpriseRecommend />;
  }

  return (
    <div className={styles.newsRecommend}>
      <div className={styles.titleWrapper}>
        <div className={styles.titleContainer}>
          <div className={styles.titleMain}>추천</div>
          <div className={styles.titleSub}>뉴스 추천</div>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <img
          className={styles.backgroundImage}
          src="https://c.animaapp.com/8Gc7c0uK/img/group@2x.png"
          alt="뉴스 추천"
        />

        {/* 뉴스 목록 */}
        <div className={styles.newsList}>
          {loading ? (
            <div>Loading...</div> // 로딩 중일 때 표시
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div> // 에러 발생 시 표시
          ) : (
            newsData.map((news, index) => (
              <div key={index} className={styles.newsItem}>
                {/* 제목을 <a> 태그로 감싸서 링크로 이동, 80자 제한 */}
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.newsText}
                  style={{ textDecoration: "none", color: "inherit" }} // 기본 스타일
                >
                  {truncateText(news.title, 75)} {/* 80자 제한 */}
                </a>
                <div className={styles.newsTime}>
                  {new Date(news.publishedAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 왼쪽 버튼 추가: EnterpriseRecommend로 이동 */}
      <LeftButtonComponent onClick={handleSwitchToEnterprise} />

      {/* 오른쪽 버튼: SectorRecommend로 이동 */}
      <ButtonComponent onClick={handleSwitchToSector} />
    </div>
  );
};

export default NewsRecommend;

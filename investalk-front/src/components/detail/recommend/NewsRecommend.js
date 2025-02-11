import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./NewsRecommend.module.css"; // CSS Module import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import SectorRecommend from "./SectorRecommend"; // SectorRecommend 컴포넌트 import
import EnterpriseRecommend from "./EnterpriseRecommend"; // EnterpriseRecommend 컴포넌트 import
import ButtonComponent from "./Button/ButtonComponent"; // 오른쪽 버튼 컴포넌트 import
import LeftButtonComponent from "./Button/LeftButtonComponent"; // 왼쪽 버튼 컴포넌트 import
import LoadingAnimation from "../../loading/LoadingAnimation";

const NewsRecommend = (props) => {
  // ** Recommend.jsx에서 넘겨준 tickerSymbol 받음 **
  const { tickerSymbol } = props;

  const [isSector, setIsSector] = useState(false);
  const [isEnterprise, setIsEnterprise] = useState(false); 
  const [newsData, setNewsData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // 뉴스 데이터를 가져오는 함수
  const fetchNewsData = async () => {
    try {
      // ** tickerSymbol을 활용해 API 호출 **
      const response = await axios.get(
        `${process.env.REACT_APP_FLASK_API_URL}/api/recommend-news?ticker=${tickerSymbol}`
      );
      setNewsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("뉴스 데이터를 가져오는 데 실패했습니다.", error);
      setError("뉴스 데이터를 가져오는 데 실패했습니다.");
      setLoading(false);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 뉴스 데이터를 가져옴
  useEffect(() => {
    fetchNewsData();
    // eslint-disable-next-line
  }, [tickerSymbol]);
  /*
    ↑ tickerSymbol이 바뀔 때마다 다시 fetch하고 싶다면 tickerSymbol을 의존성 배열에 넣어줍니다.
  */

  // SectorRecommend로 전환하는 함수
  const handleSwitchToSector = () => {
    setIsSector(true);
  };

  // EnterpriseRecommend로 전환하는 함수
  const handleSwitchToEnterprise = () => {
    setIsEnterprise(true);
  };

  // 제목을 70자 제한으로 자르고 '...' 추가하는 함수
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // 현재 상태에 따라 렌더링할 컴포넌트 결정
  if (isSector) {
    // ** tickerSymbol 그대로 넘겨서 SectorRecommend에서도 사용 가능하도록 함 **
    return <SectorRecommend tickerSymbol={tickerSymbol} />;
  }

  if (isEnterprise) {
    // ** tickerSymbol 그대로 넘겨서 EnterpriseRecommend에서도 사용 가능하도록 함 **
    return <EnterpriseRecommend tickerSymbol={tickerSymbol} />;
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
            <div style={{
              position: 'relative',
              top: '70px',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}>
              <LoadingAnimation />
            </div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : (
            newsData.map((news, index) => (
              <div key={index} className={styles.newsItem}>
                {/* 제목을 <a> 태그로 감싸서 링크로 이동, 70자 제한 */}
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.newsText}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {truncateText(news.title, 68)}
                </a>
                {/* 제목의 길이가 30자 이하일 경우 top을 20px, 그렇지 않으면 41px 설정 */}
                <div
                  className={styles.newsTime}
                  style={{ top: news.title.length <= 30 ? "20px" : "41px" }}
                >
                  {new Date(news.publishedAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 왼쪽 버튼: EnterpriseRecommend로 이동 */}
      <LeftButtonComponent onClick={handleSwitchToEnterprise} />

      {/* 오른쪽 버튼: SectorRecommend로 이동 */}
      <ButtonComponent onClick={handleSwitchToSector} />
    </div>
  );
};

export default NewsRecommend;

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EnterpriseRecommend.module.css"; // CSS Module import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import NewsRecommend from "./NewsRecommend"; // NewsRecommend 컴포넌트 import

const EnterpriseRecommend = () => {
  // 상태를 사용하여 현재 컴포넌트를 관리
  const [isNewsRecommend, setIsNewsRecommend] = useState(false);
  const [similarStocks, setSimilarStocks] = useState([]);
  const symbol = "NVDA"; // 예시로 사용할 종목 심볼

  // Finnhub API Key를 .env 파일에서 불러옴
  const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;

  // 유사 종목을 가져오는 함수
  useEffect(() => {
    const fetchSimilarStocks = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${apiKey}`
        );
        setSimilarStocks(response.data); // API에서 받은 유사 종목 설정
      } catch (error) {
        console.error("Error fetching similar stocks:", error);
      }
    };

    fetchSimilarStocks(); // 컴포넌트 로드 시 API 호출
  }, [symbol, apiKey]); // symbol 또는 apiKey 변경 시 다시 호출

  // 클릭 시 NewsRecommend로 전환하는 함수
  const handleButtonClick = () => {
    setIsNewsRecommend(true); // 버튼 클릭 시 NewsRecommend로 전환
  };

  // isNewsRecommend 상태에 따라 컴포넌트 렌더링
  if (isNewsRecommend) {
    return <NewsRecommend />;
  }

  return (
    <div className={styles.enterpriseRecommend}>
      <div className={styles.contentWrapper}>
        <div className={styles.metricsContainer}>
          <img
            className={styles.backgroundImage}
            src="https://c.animaapp.com/8Gc7c0uK/img/group@2x.png"
            alt="vector"
          />
          <div className={styles.metricItem}>
            <div className={styles.metricTitle}>분기별 매출 성장률</div>
            <div className={styles.metricValue}>
              <div className={styles.metricValueText}>+</div>
              <div className={styles.metricValueText}>30%</div>
            </div>
          </div>
          <div className={styles.similarStocks}>
            <div className={styles.metricTitle}>유사한 종목</div>
            <div className={styles.stocksWrapper}>
              <div className={styles.stocksList}>
                {/* 첫 번째 종목은 제외하고 그 뒤 4개만 출력 */}
                {similarStocks.slice(1, 5).map((stock) => (
                  <div key={stock} className={styles.metricValueText}>
                    {stock}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.metricItemSecond}>
          <div className={styles.metricTitle}>현금유동성</div>
          <div className={styles.metricValue}>
            <div className={styles.metricValueText}>+</div>
            <div className={styles.metricValueText}>30%</div>
          </div>
        </div>
      </div>

      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          <div className={styles.titleMain}>추천</div>
          <div className={styles.titleSub}>기업</div>
        </div>
      </div>

      {/* group14 버튼 클릭 시 NewsRecommend로 전환 */}
      <div className={styles.group14} onClick={handleButtonClick} style={{ cursor: 'pointer' }}>
        <div className={styles.overlap8}>
          <div className={styles.ellipse4}></div>
          <img
            className={styles.subtract}
            src="https://c.animaapp.com/8Gc7c0uK/img/subtract.svg"
            alt="Subtract"
          />
          <img
            className={styles.vector3}
            src="https://c.animaapp.com/8Gc7c0uK/img/vector-2.svg"
            alt="Vector"
          />
        </div>
      </div>
    </div>
  );
};

export default EnterpriseRecommend;

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EnterpriseRecommend.module.css"; // CSS Module import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import NewsRecommend from "./NewsRecommend"; // NewsRecommend 컴포넌트 import

const EnterpriseRecommend = () => {
  const [isNewsRecommend, setIsNewsRecommend] = useState(false);
  const [similarStocks, setSimilarStocks] = useState([]);
  const [averageGrowth, setAverageGrowth] = useState({
    cashFlowGrowth: null,
    revenueGrowth: null,
  }); // 평균 성장률 상태 추가

  const symbol = "NVDA"; // NVDA 심볼을 그대로 유지
  const apiKey = process.env.REACT_APP_FINNHUB_API_KEY; // .env에서 API 키 불러오기

  // 유사 종목을 가져오는 함수
  useEffect(() => {
    const fetchSimilarStocks = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/stock/peers?symbol=${symbol}&token=${apiKey}`
        );
        
        // Finnhub에서 5개를 받아오고, 첫 번째 종목(NVDA)을 제외한 4개의 유사 종목 중 상위 3개 선택
        const fourSimilarStocks = response.data.slice(1, 5); // 1부터 5까지, 첫 번째(NVDA)는 제외하고 4개 선택
        setSimilarStocks(fourSimilarStocks); // 4개의 유사 종목 설정

        // 첫 번째 종목(NVDA)을 추가하여 백엔드로 보내기 위해 NVDA + 3개의 유사 종목 구성
        const threeStocksForBackend = fourSimilarStocks.slice(0, 3); 

        // 백엔드로 NVDA와 함께 3개의 종목을 보냄
        await fetchAverageGrowth([symbol, ...threeStocksForBackend]);

      } catch (error) {
        console.error("Error fetching similar stocks:", error);
      }
    };

    fetchSimilarStocks(); // 컴포넌트 로드 시 유사 종목 API 호출
  }, [symbol, apiKey]);

  // Flask API로 평균 현금 유동성과 매출 성장률을 가져오는 함수
  const fetchAverageGrowth = async (tickers) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/average-growth", {
        tickers, // NVDA와 함께 3개의 종목을 Flask API에 전달
      });
      setAverageGrowth({
        cashFlowGrowth: response.data.average_cash_flow_growth,
        revenueGrowth: response.data.average_revenue_growth,
      });
    } catch (error) {
      console.error("Error fetching average growth:", error);
    }
  };

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
              <div className={styles.metricValueText}>
                {averageGrowth.revenueGrowth !== null
                  ? `${averageGrowth.revenueGrowth.toFixed(2)}%`
                  : "Loading..."} {/* 매출 성장률 출력 */}
              </div>
            </div>
          </div>
          <div className={styles.similarStocks}>
            <div className={styles.metricTitle}>유사한 종목</div>
            <div className={styles.stocksWrapper}>
              <div className={styles.stocksList}>
                {/* 4개의 유사 종목 모두 출력 (NVDA 제외하고 4개) */}
                {similarStocks.map(stock => (
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
            <div className={styles.metricValueText}>
              {averageGrowth.cashFlowGrowth !== null
                ? `${averageGrowth.cashFlowGrowth.toFixed(2)}%`
                : "Loading..."} {/* 현금 유동성 성장률 출력 */}
            </div>
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
      <div className={styles.group14} onClick={handleButtonClick} style={{ cursor: "pointer" }}>
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

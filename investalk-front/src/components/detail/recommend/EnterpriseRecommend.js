import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EnterpriseRecommend.module.css"; // CSS Module import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import NewsRecommend from "./NewsRecommend"; // NewsRecommend 컴포넌트 import
import SectorRecommend from "./SectorRecommend"; // SectorRecommend 컴포넌트 import
import ButtonComponent from "./Button/ButtonComponent"; // 오른쪽 버튼 컴포넌트 import
import LeftButtonComponent from "./Button/LeftButtonComponent"; // 왼쪽 버튼 컴포넌트 import
import LoadingAnimation from "../../loading/LoadingAnimation";

const EnterpriseRecommend = (props) => {
  // **Recommend.jsx에서 전달받은 tickerSymbol 받아오기**
  const { tickerSymbol } = props;

  const [isNewsRecommend, setIsNewsRecommend] = useState(false);
  const [isSectorRecommend, setIsSectorRecommend] = useState(false);
  const [similarStocks, setSimilarStocks] = useState([]);
  const [averageGrowth, setAverageGrowth] = useState({
    cashFlowGrowth: null,
    revenueGrowth: null,
  }); // 평균 성장률 상태

  // **tickerSymbol과 .env에서 API 키 불러오기**
  const apiKey = process.env.REACT_APP_FINNHUB_API_KEY;
  const flaskApiUrl = process.env.REACT_APP_FLASK_API_URL;

  // 유사 종목을 가져오는 함수
  useEffect(() => {
    const fetchSimilarStocks = async () => {
      try {
        // **tickerSymbol을 사용하여 Finnhub API 호출**
        const response = await axios.get(
          `https://finnhub.io/api/v1/stock/peers?symbol=${tickerSymbol}&token=${apiKey}`
        );

        // 첫 번째 원소(현재 tickerSymbol)는 제외하고 4개 선택
        const fourSimilarStocks = response.data.slice(1, 5);
        setSimilarStocks(fourSimilarStocks);

        // Flask 백엔드에서 평균 성장률 계산 시 사용할 종목 리스트
        const threeStocksForBackend = fourSimilarStocks.slice(0, 3);

        // 현재 tickerSymbol 포함해서 총 4개 종목의 성장률 조회
        await fetchAverageGrowth([tickerSymbol, ...threeStocksForBackend]);
      } catch (error) {
        console.error("Error fetching similar stocks:", error);
      }
    };

    // 컴포넌트 로드 시 유사 종목 API 호출
    fetchSimilarStocks();
  }, [tickerSymbol, apiKey]);

  const fetchAverageGrowth = async (tickers) => {
    try {
      const response = await axios.post(`${flaskApiUrl}/api/average-growth`, {
        tickers,
      });
      setAverageGrowth({
        cashFlowGrowth: response.data.average_cash_flow_growth,
        revenueGrowth: response.data.average_revenue_growth,
      });
    } catch (error) {
      console.error("Error fetching average growth:", error);
    }
  };

  // 오른쪽 버튼 클릭 시 NewsRecommend로 전환
  const handleButtonClick = () => {
    setIsNewsRecommend(true);
  };

  // 왼쪽 버튼 클릭 시 SectorRecommend로 전환
  const handleLeftButtonClick = () => {
    setIsSectorRecommend(true);
  };

  // **NewsRecommend가 true면 해당 컴포넌트로 전환** (tickerSymbol 함께 전달)
  if (isNewsRecommend) {
    return <NewsRecommend tickerSymbol={tickerSymbol} />;
  }

  // **SectorRecommend가 true면 해당 컴포넌트로 전환** (tickerSymbol 함께 전달)
  if (isSectorRecommend) {
    return <SectorRecommend tickerSymbol={tickerSymbol} />;
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
                  : (
                    <div style={{
                      position: 'relative',
                      top: '20px',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1000
                    }}>
                      <LoadingAnimation />
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className={styles.similarStocks}>
            <div className={styles.metricTitle}>유사한 종목</div>
            <div className={styles.stocksWrapper}>
              <div className={styles.stocksList}>
                {similarStocks.map((stock) => (
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
                : (
                  <div style={{
                    position: 'relative',
                    top: '20px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000
                  }}>
                    <LoadingAnimation />
                  </div>
                )}
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

      {/* 왼쪽 버튼(SectorRecommend로 전환) */}
      <LeftButtonComponent onClick={handleLeftButtonClick} />

      {/* 오른쪽 버튼(NewsRecommend로 전환) */}
      <ButtonComponent onClick={handleButtonClick} />
    </div>
  );
};

export default EnterpriseRecommend;

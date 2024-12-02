import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StockInfoCard.module.css";
import StockInfoChart from "./chart";
import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";

const StockInfoCard = (props) => {
  const { tickerSymbol } = props;

  const [variant, setVariant] = useState("outlined");
  const [isLike, setIsLike] = useState(false); // 즐겨찾기 상태
  const [period, setPeriod] = useState("1d");
  const [stockInfo, setStockInfo] = useState({});
  const [percentageChange, setPercentageChange] = useState(0);

  // Axios 기본 설정: 쿠키 자동 전송
  axios.defaults.withCredentials = true;

  // 환경 변수에서 Flask URL 가져오기
  const FLASK_URL = process.env.REACT_APP_FLASK_URL;

  // 종목 정보 가져오기
  useEffect(() => {
    const getStockInfo = async () => {
      try {
        const response = await axios.get(`${FLASK_URL}/api/stockinfo/${tickerSymbol}`);
        setStockInfo(response.data);
      } catch (error) {
        console.error("Error fetching stock info:", error);
      }
    };
    getStockInfo();
  }, [tickerSymbol, FLASK_URL]);

  // 즐겨찾기 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await axios.get(`${FLASK_URL}/api/user/favorite_stocks`);

        // 즐겨찾기 목록에서 현재 tickerSymbol 존재 여부 확인
        const favoriteStocks = response.data;
        console.log("Favorite Stocks:", favoriteStocks); // 디버깅 로그 추가
        const isFavorite = favoriteStocks.some((stock) => stock.symbol === tickerSymbol);

        setIsLike(isFavorite); // 상태 업데이트
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkFavoriteStatus();
  }, [tickerSymbol, FLASK_URL]);


  // 즐겨찾기 토글 처리
  const handleFavoriteToggle = async () => {
    try {
      const desiredPrice = 100; // 기본 희망 가격 예시
      if (isLike) {
        // 즐겨찾기에서 제거
        await axios.delete(`${FLASK_URL}/api/user/remove_favorite`, {
          data: { symbol: tickerSymbol },
        });
        setIsLike(false); // 상태 업데이트
      } else {
        // 즐겨찾기에 추가
        await axios.post(
          `${FLASK_URL}/api/user/add_favorite`,
          {
            symbol: tickerSymbol,
            desired_price: desiredPrice, // 희망 가격 전달
          },
          { withCredentials: true }
        );
        setIsLike(true); // 상태 업데이트
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      if (error.response && error.response.status === 401) {
        alert("로그인을 먼저 해주세요.");
      } else if (error.response && error.response.status === 500) {
        alert("서버에서 문제가 발생했습니다.");
      } else {
        alert("네트워크 오류가 발생했습니다.");
      }
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div>
      <div className={styles["group-15"]}>
        <div className={styles["group-16"]}>
          <div className={styles["overlap-9"]}>
            <div className={styles["group-17"]}>
              <div className={styles["frame-25"]}>
                <div className={styles["text-wrapper-28"]}>
                  {stockInfo.sector}
                </div>
                <div className={styles["text-wrapper-29"]}>
                  Symbol: {stockInfo.symbol}
                </div>
              </div>
              <div className={styles["frame-26"]}>
                <div className={styles["frame-27"]}>
                  <img
                    className={styles["group-18"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/group-2@2x.png"
                    alt="icon"
                  />
                  <div className={styles["text-wrapper-30"]}>
                    {stockInfo.price || "N/A"}
                  </div>
                </div>
                <div className={styles["frame-28"]}>
                  <img
                    className={styles["group-18"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/group-2@2x.png"
                    alt="icon"
                  />
                  <div className={styles["frame-27"]}>
                    <div className={styles["text-wrapper-31"]}>
                      analyst rating
                    </div>
                    <div className={styles["text-wrapper-31"]}>
                      {stockInfo.analyst_rating || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["graph-group"]}>
                <div className={styles["group-20"]}>
                  <StockInfoChart
                    tickerSymbol={tickerSymbol}
                    period={period}
                    setPercentageChange={setPercentageChange}
                  />
                </div>
                <div className={styles["group-19"]}>
                  <div className={styles["frame-29"]}>
                    <ButtonGroup
                      className={styles["frame-30"]}
                      variant={variant}
                      size="xs"
                      color="primary"
                      aria-label="radius button group"
                      sx={{ "--ButtonGroup-radius": "40px" }}
                    >
                      <Button
                        className={styles["text-wrapper-32"]}
                        onClick={() => handlePeriodChange("1d")}
                      >
                        1일
                      </Button>
                      <Button
                        className={styles["text-wrapper-32"]}
                        onClick={() => handlePeriodChange("1m")}
                      >
                        1달
                      </Button>
                      <Button
                        className={styles["text-wrapper-32"]}
                        onClick={() => handlePeriodChange("1y")}
                      >
                        1년
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div className={styles["text-wrapper-group"]}>
                    <div className={styles["text-wrapper-33"]}>
                      {percentageChange > 0
                        ? `+${percentageChange}%`
                        : `${percentageChange}%`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles["group-22"]}>
              <div className={styles["overlap-group-4"]}>
                {isLike ? (
                  <img
                    className={styles["vector-5"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-4.svg"
                    alt="icon"
                    onClick={handleFavoriteToggle}
                  />
                ) : (
                  <img
                    className={styles["vector-4"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-3.svg"
                    alt="icon"
                    onClick={handleFavoriteToggle}
                  />
                )}
                <div className={styles["text-wrapper-35"]}>
                  {stockInfo.name
                    ? stockInfo.name.length > 40
                      ? stockInfo.name.substring(0, 40) + "..."
                      : stockInfo.name
                    : stockInfo.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInfoCard;

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StockInfoCard.module.css";

import StockInfoChart from "./chart";

import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";

const StockInfoCard = (props) => {
  const { tickerSymbol } = props;

  const [variant, setVariant] = useState("outlined");
  const [isLike, setIsLike] = useState(false);

  const [period, setPeriod] = useState("1d");

  const [stockInfo, setStockInfo] = useState({});
  const [analyzedStockScore, setAnalyedStockScore] = useState(0.0);

  const [percentageChange, setPercentageChange] = useState(0);

  useEffect(() => {
    const getStockInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/stockinfo/${tickerSymbol}`
        );
        console.log("fetch data: ", response.data);
        setStockInfo(response.data);
      } catch (error) {
        console.error("Error fetching scraps:", error);
      }
    };
    getStockInfo();
  }, [tickerSymbol]);

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
                    {analyzedStockScore}
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
                      {stockInfo.analyst_rating}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["graph-group"]}>
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
                  <div className={styles["group-20"]}>
                    <StockInfoChart
                      tickerSymbol={tickerSymbol}
                      period={period}
                      setPercentageChange={setPercentageChange}
                    ></StockInfoChart>
                  </div>
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
            <div className={styles["group-22"]}>
              <div className={styles["overlap-group-4"]}>
                {isLike === false ? (
                  <img
                    className={styles["vector-4"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-3.svg"
                    alt="icon"
                    onClick={() => {
                      setIsLike(true);
                    }}
                  />
                ) : (
                  <img
                    className={styles["vector-5"]}
                    src="https://c.animaapp.com/8Gc7c0uK/img/vector-4.svg"
                    alt="icon"
                    onClick={() => {
                      setIsLike(false);
                    }}
                  />
                )}
                <div className={styles["text-wrapper-35"]}>
                  {stockInfo.name}
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

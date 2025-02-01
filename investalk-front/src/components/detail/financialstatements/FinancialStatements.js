import { useEffect, useState } from "react";
import styles from "./FinancialStatements.module.css";
import axios from "axios";
import LoadingAnimation from "../../loading/LoadingAnimation";

const FinancialStatements = (props) => {
  const { tickerSymbol } = props;
  console.log("FinancialStatements: ", tickerSymbol);

  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  useEffect(() => {
    const getFinancial = async () => {
      try {
        setLoading(true); // 데이터 요청 시작 시 로딩 true
        const response = await axios.get(
          `http://localhost:5000/api/quarterlyfinancials/${tickerSymbol}`
        );
        console.log("fetch data: ", response.data);

        // 백엔드에서 받아온 데이터 매핑
        setCategories({
          수익성: {
            현금유동성: response.data.cash_growth,
            순수익: response.data.net_income_growth,
            EPS: response.data.eps_growth,
            마진: response.data.profit_margin_growth,
          },
          안정성: {
            빚: response.data.net_debt_growth,
            현금: response.data.cash_growth,
            영업비용: response.data.operating_expenses_growth,
            유동비율: response.data.current_ratio, // 유동비율 (소수점 그대로 출력)
          },
          시장추세: {
            RSI: response.data.rsi_growth,
            기름: response.data.crude_oil_price_growth,
            자금유입: response.data.cash_inflow_growth,
            채권: response.data.treasury_bond_growth,
          },
        });
      } catch (error) {
        console.error("Error fetching scraps:", error);
      } finally {
        setLoading(false); // 완료 후 로딩 false
      }
    };
    getFinancial();
  }, [tickerSymbol]);

  return (
    <div>
      <div className={styles["group-wrapper"]}>
        <div className={styles["group-2"]}>
          <div className={styles["text-wrapper-2"]}>재무제표</div>
          <div className={styles.frame}>
            {loading ? (
              <div
                style={{
                  position: "relative",
                  top: "75px",
                  left: "220px",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                }}
              >
                <LoadingAnimation />
              </div>
            ) : (
              Object.keys(categories).map((category, index) => (
                <div className={styles["frame-wrapper"]} key={index}>
                  <div className={styles["frame-2"]}>
                    <div className={styles["frame-3"]}>
                      <div className={styles["frame-4"]}>
                        <div className={styles["text-wrapper-3"]}>{category}</div>
                        <div className={styles["text-wrapper-4"]}>·</div>
                        <div className={styles["text-wrapper-5"]}>분기별</div>
                      </div>
                      <div className={styles["frame-5"]}>
                        {Object.keys(categories[category]).map((item, idx) => {
                          const value = categories[category][item];
                          const isNumber = typeof value === "number" && !isNaN(value);
                          const isCurrentRatio = item === "유동비율";

                          return (
                            <div className={styles["frame-6"]} key={idx}>
                              <div className={styles["text-wrapper-6"]}>{item}</div>
                              <div className={styles["frame-7"]}>
                                {/* 유동비율이 아닌 수치 항목이고, 양수면 + 기호 붙임 */}
                                <div className={styles["text-wrapper-7"]}>
                                  {!isCurrentRatio && isNumber && value >= 0 ? "+" : ""}
                                </div>
                                <div className={styles["text-wrapper-8"]}>
                                  {/* 유동비율이면 그대로, 아니면 % 붙여서 표시 */}
                                  {isNumber
                                    ? isCurrentRatio
                                      ? value // 유동비율은 그대로 출력(예: 0.87)
                                      : `${value}%` // 나머지 항목은 % 붙여 출력
                                    : value // N/A 등 숫자가 아닐 경우 그대로 출력
                                  }
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;

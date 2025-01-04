import { useEffect, useState } from "react";
import styles from "./FinancialStatements.module.css";
import axios from "axios";

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
            마진: response.data.profit_margin_growth,
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
            {/* 로딩 중일 때는 "Loading..." 표시, 완료되면 데이터 맵핑 */}
            {loading ? (
              <div>Loading...</div>
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
                        {Object.keys(categories[category]).map((item, idx) => (
                          <div className={styles["frame-6"]} key={idx}>
                            <div className={styles["text-wrapper-6"]}>{item}</div>
                            <div className={styles["frame-7"]}>
                              <div className={styles["text-wrapper-7"]}>
                                {categories[category][item] >= 0 ? "+" : ""}
                              </div>
                              <div className={styles["text-wrapper-8"]}>
                                {`${categories[category][item]}%`}
                              </div>
                            </div>
                          </div>
                        ))}
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

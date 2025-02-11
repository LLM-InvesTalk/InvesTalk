import React from "react";
import { useEffect, useState } from "react";
import styles from "./Analyze.module.css"; // CSS 모듈 import
import axios from "axios";
import LoadingAnimation from "../../loading/LoadingAnimation";

const Analyze = (props) => {
  const { tickerSymbol } = props;

  const [assistockAnalyze, setAssistockAnalyze] = useState({});
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  useEffect(() => {
    const getAnalyze = async () => {
      try {
        setLoading(true); // 데이터 요청 시작 시 로딩 true
        const response = await axios.get(
          `http://localhost:5000/api/chat/analyze/${tickerSymbol}`
        );
        console.log("fetch data: ", response.data);

        setAssistockAnalyze(response.data);
      } catch (error) {
        console.error("Error fetching scraps:", error);
      } finally {
        setLoading(false); // 완료 후 로딩 false
      }
    }
    getAnalyze();
  }, [tickerSymbol]);

  return (
    <div className={styles.divWrapper}>
      <div className={styles.overlapWrapper}>
        <div className={styles.overlap3}>
          <div className={styles.textWrapper}>Assistock 분석서</div>
          <div className={styles.textDescription}>
            {loading ? (
              <div style={{
                position: 'relative',
                top: '55%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
              }}>
                <LoadingAnimation />
              </div>
            ) : (assistockAnalyze.reply ? assistockAnalyze.reply : "데이터가 없습니다.")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;

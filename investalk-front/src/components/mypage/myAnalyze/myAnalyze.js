import React, { useState, useEffect } from "react";
import styles from "./myAnalyze.module.css";
import "../css/DetailGlobals.css"; // 글로벌 css
import "../css/DetailStyleguide.css"; // 글로벌 css
import SummedGraph from "./graph/summedGraph";
import LoadingAnimation from "../../loading/LoadingAnimation";

const FLASK_URL = process.env.REACT_APP_FLASK_URL;

const MyAnalyze = () => {
  // summation 그래프 데이터 상태
  const [summedGraphData, setSummedGraphData] = useState([]);

  useEffect(() => {
    const fetchSummedGraph = async () => {
      try {
        // fetch API 사용 시 쿠키(세션) 정보를 포함하려면:
        const response = await fetch(`${FLASK_URL}/api/user/favorite_stocks/summed_graph`, {
          method: "GET",
          // key option
          credentials: "include", // 쿠키 전송 허용
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const { summed_graph } = await response.json();
        setSummedGraphData(summed_graph);
      } catch (error) {
        console.error("Error fetching summed graph data:", error);
      }
    };

    fetchSummedGraph();
  }, []);

  return (
    <div className={styles.divWrapper}>
      <div className={styles.group2}>
        <div className={styles.vector}>
          {/* 
            // 데이터 받아오는 동안 Loading... 표시
            // 데이터가 존재하면 SummedGraph 표시
          */}
          {summedGraphData.length === 0 ? (
            <div className={styles.loadingWrapper}>
              <div style={{
                position: 'relative',
                top: '60px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
              }}>
                <LoadingAnimation />
              </div>
            </div>
          ) : (
            <SummedGraph data={summedGraphData} />
          )}
        </div>

        <div className={styles.group3}>
          <p className={styles.element}>
            000님의 보유 자산은 ~~ 하고 ~~ 되고 있습니다. ~~~~~~~~~~~~~~~~~~~~~~<br />
            블라블라블라블라...<br />
            000님의 보유 자산은 ~~ 하고 ~~ 되고 있습니다.
          </p>
          <div className={styles.overlapGroup2}>
            <img
              className={styles.burstPucker4}
              src="https://c.animaapp.com/99LNnW64/img/burst-pucker-2-3.svg"
              alt="Pucker Icon 1"
            />
            <img
              className={styles.burstPucker5}
              src="https://c.animaapp.com/99LNnW64/img/burst-pucker-2-4.svg"
              alt="Pucker Icon 2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAnalyze;

import React, { useState, useEffect } from "react";
import styles from "./myAnalyze.module.css";
import "../css/DetailGlobals.css"; // 글로벌 css
import "../css/DetailStyleguide.css"; // 글로벌 css
import SummedGraph from "./graph/summedGraph";
import LoadingAnimation from "../../loading/LoadingAnimation";

// [!] 최신 openai import
import OpenAI from "openai";

const FLASK_URL = process.env.REACT_APP_FLASK_URL;

const MyAnalyze = () => {
  // summation 그래프 데이터 상태
  const [summedGraphData, setSummedGraphData] = useState([]);

  // ChatGPT API 응답 상태
  const [chatGPTResponse, setChatGPTResponse] = useState("");

  useEffect(() => {
    const fetchSummedGraph = async () => {
      try {
        // fetch API 사용 시 쿠키(세션) 정보를 포함하려면:
        const response = await fetch(`${FLASK_URL}/api/user/favorite_stocks/summed_graph`, {
          method: "GET",
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

    // ChatGPT API 요청 함수
    const fetchChatGPT = async () => {
      try {
        const openai = new OpenAI({
          apiKey: process.env.REACT_APP_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true, // 브라우저 환경 허용
        });

        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "너는 주식관련 상담 챗봇이야. 내가 자산 규모에 대한 정보를 줄테니, 그 자산이 어떤 경향을 가지고 있는지 대략 70자 내외로 설명해줘.간단 명료하게 설명해줘.",
            },
            {
              role: "user",
              content: "테스트 자산규모 데이터 예시: 100, 50, 100, 130.",
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        });

        const result = response.choices[0].message.content;
        setChatGPTResponse(result);
      } catch (error) {
        console.error("Error calling ChatGPT API:", error);
      }
    };

    fetchSummedGraph();
    fetchChatGPT();
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
            {chatGPTResponse && (
              <span style={{ display: "block", marginTop: "1rem" }}>
                {chatGPTResponse}
              </span>
            )}
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

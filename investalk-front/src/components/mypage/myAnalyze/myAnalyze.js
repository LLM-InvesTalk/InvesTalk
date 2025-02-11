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

  // 백엔드에서 받아올 ticker, averagedGraph도 상태로 관리
  const [tickers, setTickers] = useState([]);
  const [averagedGraph, setAveragedGraph] = useState([]);

  // ChatGPT API 응답 상태
  const [chatGPTResponse, setChatGPTResponse] = useState("");

  // [!] Recommend 컴포넌트와 마찬가지로 로딩, 에러 상태 추가
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);      // 에러 상태

  useEffect(() => {
    // [1] 종합 그래프 데이터 받아오는 함수
    const fetchSummedGraph = async () => {
      try {
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

        // 백엔드에서 받은 summed_graph, tickers, averaged_graph를 디스트럭처링
        const { summed_graph, tickers, averaged_graph } = await response.json();

        // 디버깅용: 백엔드 응답 로그
        console.log("백엔드 응답 data:", { summed_graph, tickers, averaged_graph });

        // 정상적으로 응답을 받으면 반환
        return { summed_graph, tickers, averaged_graph };

      } catch (error) {
        console.error("Error fetching summed graph data:", error);
        // [!] 에러 상태 업데이트
        setError("데이터를 불러오지 못했습니다.");
        // 에러 시 빈 데이터 반환
        return { summed_graph: [], tickers: [], averaged_graph: [] };
      }
    };

    // [2] ChatGPT API 호출 함수 (averagedGraph, tickers를 인자로 받음)
    const fetchChatGPT = async (averagedGraphParam, tickersParam) => {
      try {
        console.log("ChatGPT 호출 직전 averagedGraphParam:", averagedGraphParam);
        console.log("ChatGPT 호출 직전 tickersParam:", tickersParam);

        const openai = new OpenAI({
          apiKey: process.env.REACT_APP_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true, // 브라우저 환경 허용
        });

        // system + user 메시지를 구성
        const messages = [
          {
            role: "system",
            content:
              "너는 주식관련 상담 챗봇이야. 내가 자산과 종목에 대한 정보를 줄테니, 그 자산이 어떤 경향을 가지고 있는지 대략 70자 내외로 설명해줘. 종목들의 포트폴리오 경향도 대략적으로 설명해줘",
          },
          {
            role: "user",
            content: `실제 서버 평균 자산규모(averaged_graph): ${averagedGraphParam.join(", ")}
티커(tickers): ${tickersParam.join(", ")}`,
          },
        ];

        // 콘솔에서 확인하기 위해 로그 출력
        console.log("ChatGPT에 보낼 메시지:", messages);

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          max_tokens: 300,
          temperature: 0.7,
        });

        const result = response.choices[0].message.content;
        setChatGPTResponse(result);

      } catch (error) {
        console.error("Error calling ChatGPT API:", error);
        // [!] ChatGPT API 오류 시 에러 상태 업데이트
        setError("ChatGPT API 호출에 실패했습니다.");
      } finally {
        // [!] 모든 작업이 끝나면 로딩을 종료
        setLoading(false);
      }
    };

    // [3] 데이터 가져온 후 -> ChatGPT 호출
    fetchSummedGraph().then(({ summed_graph, tickers, averaged_graph }) => {
      // React 상태 업데이트 (그래프 표시용)
      setSummedGraphData(summed_graph);
      setTickers(tickers);
      setAveragedGraph(averaged_graph);

      // 평균 그래프 + 티커 정보를 ChatGPT에 전달
      fetchChatGPT(averaged_graph, tickers);
    });
  }, []);

  return (
    <div className={styles.divWrapper}>
      <div className={styles.group2}>
        <div className={styles.vector}>
          {/* 
            로딩 중이라면 로딩 애니메이션 표시,
            에러가 있다면 에러 메시지 표시,
            둘 다 아니면 SummedGraph 데이터 표시
          */}
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div
                style={{
                  position: "relative",
                  top: "60px",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1000,
                }}
              >
                <LoadingAnimation />
              </div>
            </div>
          ) : error ? (
            <div style={{ color: "red", fontWeight: "bold" }}>
              {error}
            </div>
          ) : (
            <SummedGraph data={summedGraphData} />
          )}
        </div>

        <div className={styles.group3}>
          {/* 화면에는 chatGPTResponse만 표시 (system/user 메시지는 보이지 않음) */}
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

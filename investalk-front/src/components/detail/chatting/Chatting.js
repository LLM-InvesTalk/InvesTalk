import { React, useEffect, useRef, useState } from "react";
import styles from "./Chatting.module.css"; // CSS 모듈 import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import CustomerMessage from "./CustomerMessage"; // 고객 메시지 컴포넌트 import
import GptMessage from "./GptMessage"; // GPT 메시지 컴포넌트 import
import PieChartMessage from "./PieChartMessage"; // PieChartMessage 컴포넌트 import
import GraphChatting from "./GraphChatting"; // GraphChatting 컴포넌트 import
import ChatInput from "./ChatInput"; // ChatInput 컴포넌트 import
import axios from "axios";

const Chatting = () => {
  const chatContainerRef = useRef(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // 화살표 상태 관리

  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState([]); // 메시지 상태 관리

  const scrollToTop = () => {
    if (chatContainerRef.current) {
      console.log("scrolling to top"); // 스크롤 함수가 호출되었는지 확인
      chatContainerRef.current.scrollTop = 0; // 스크롤을 맨 위로 이동
    } else {
      console.log("chatContainerRef is null");
    }
  };

  const sendMessage = async (message) => {
    // 고객 메시지 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "customer", message, time: new Date().toLocaleTimeString() },
    ]);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/${encodeURIComponent(message)}`
      );

      console.log("response: ", response);

      // GPT 응답 메시지 추가
      if (response.status === 200 && response.data) {
        const generatedText =
          response.data.generated_text || "응답을 가져오는 데 실패했습니다.";
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "gpt",
            message: generatedText,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      } else {
        console.error(`Error: ${response.status}, ${response.data}`);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "gpt",
            message: "GPT 응답을 가져오는 중 문제가 발생했습니다.",
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch (error) {
      console.error("GPT 요청 중 오류 발생:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "gpt",
          message: "GPT 서버와의 연결에 실패했습니다.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        // 스크롤 위치가 특정 값 이상일 때만 화살표 표시
        if (chatContainerRef.current.scrollTop > 100) {
          setShowScrollToTop(true);
        } else {
          setShowScrollToTop(false);
        }
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={styles.divWrapper}>
      <div className={styles.overlapGroupWrapper}>
        <div className={styles.overlap4}>
          <div className={styles.textWrapper18}>Assistalk</div>
          <div className={styles.group3} ref={chatContainerRef}>
            {/* 메시지 상태를 순회하며 렌더링 */}
            {messages.map((msg, index) =>
              msg.type === "customer" ? (
                <CustomerMessage
                  key={index}
                  message={msg.message}
                  time={msg.time}
                />
              ) : (
                <GptMessage key={index} message={msg.message} time={msg.time} />
              )
            )}
          </div>
          <div className={styles.rectangle7}></div>
          {/* 하단 채팅 입력창 컴포넌트 */}
          <ChatInput
            scrollToTop={scrollToTop}
            showScrollToTop={showScrollToTop}
            chatText={chatText}
            setChatText={setChatText}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatting;

import { React, useEffect, useRef, useState } from "react";
import styles from "./Chatting.module.css"; // CSS 모듈 import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import CustomerMessage from "./CustomerMessage"; // 고객 메시지 컴포넌트 import
import GptMessage from "./GptMessage"; // GPT 메시지 컴포넌트 import
import PieChartMessage from "./PieChartMessage"; // PieChartMessage 컴포넌트 import
import GraphChatting from "./GraphChatting"; // GraphChatting 컴포넌트 import
import ChatInput from "./ChatInput"; // ChatInput 컴포넌트 import

const Chatting = () => {
  const chatContainerRef = useRef(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // 화살표 상태 관리

  const scrollToTop = () => {
    if (chatContainerRef.current) {
      console.log("scrolling to top"); // 스크롤 함수가 호출되었는지 확인
      chatContainerRef.current.scrollTop = 0; // 스크롤을 맨 위로 이동
    } else {
      console.log("chatContainerRef is null");
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
            {/* 고객 메시지 컴포넌트 */}
            <CustomerMessage message="고객용메세지" time="00:00" />
            {/* GPT 메시지 컴포넌트 */}
            <GptMessage message="상대 메세지" time="00:00" />
            {/* 파이차트 메시지 컴포넌트 */}
            <PieChartMessage />
            {/* 그래프 채팅 메시지 컴포넌트 */}
            <GraphChatting />
            <CustomerMessage message="고객용메세지" time="00:00" />
            <CustomerMessage message="고객용메세지" time="00:00" />
            <CustomerMessage message="고객용메세지" time="00:00" />
            <CustomerMessage message="고객용메세지" time="00:00" />
          </div>
          <div className={styles.rectangle7}></div>
          {/* 하단 채팅 입력창 컴포넌트 */}
          <ChatInput
            scrollToTop={scrollToTop}
            showScrollToTop={showScrollToTop}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatting;

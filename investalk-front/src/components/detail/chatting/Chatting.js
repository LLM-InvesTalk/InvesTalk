import React from "react";
import styles from "./Chatting.module.css"; // CSS 모듈 import
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import CustomerMessage from "./CustomerMessage"; // 고객 메시지 컴포넌트 import
import GptMessage from "./GptMessage"; // GPT 메시지 컴포넌트 import
import PieChartMessage from "./PieChartMessage"; // PieChartMessage 컴포넌트 import
import GraphChatting from "./GraphChatting"; // GraphChatting 컴포넌트 import
import ChatInput from "./ChatInput"; // ChatInput 컴포넌트 import

// 최상위 컴포넌트
const Chatting = () => {
  return (
    <div className={styles.divWrapper}>
      <div className={styles.overlapGroupWrapper}>
        <div className={styles.overlap4}>
          <div className={styles.group3}>
            {/* 고객 메시지 컴포넌트 */}
            <CustomerMessage message="고객용메세지" time="00:00" />
            {/* GPT 메시지 컴포넌트 */}
            <GptMessage message="상대 메세지" time="00:00" />
            {/* 파이차트 메시지 컴포넌트 */}
            <PieChartMessage />
            {/* 그래프 채팅 메시지 컴포넌트 */}
            <GraphChatting />
          </div>
          <div className={styles.textWrapper18}>Assistalk</div>
          {/* 하단 채팅 입력창 컴포넌트 */}
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Chatting;

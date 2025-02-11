import React, { useCallback } from "react";
import styles from "./ChatInput.module.css"; // 기존 CSS 모듈을 그대로 import

const ChatInput = ({
  scrollToBottom, // 맨 아래로 스크롤 함수
  showScrollToBottom, // 맨 아래로 이동 화살표 표시 여부
  chatText,
  setChatText,
  sendMessage,
}) => {
  const onChange = useCallback((e) => {
    setChatText(e.target.value);
  }, []);

  const onKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && chatText.trim() !== "") {
        sendMessage(chatText); // 메시지 전송
        setChatText(""); // 입력 필드 초기화
        e.preventDefault(); // 기본 Enter 동작 방지 (예: 폼 제출)
      }
    },
    [chatText, sendMessage, setChatText]
  );

  return (
    <div className={styles.group10}>
      <div className={styles.overlap6}>
        <input
          className={styles.textWrapper19}
          value={chatText}
          onChange={onChange}
          onKeyPress={onKeyPress} // Enter 이벤트 연결
          placeholder="메세지를 입력해 주세요."
        />
      </div>
      {showScrollToBottom && (
        <img
          className={styles.vector2}
          src="https://c.animaapp.com/8Gc7c0uK/img/vector-1.svg"
          alt="vector"
          onClick={() => scrollToBottom()}
        />
      )}
    </div>
  );
};

export default ChatInput;

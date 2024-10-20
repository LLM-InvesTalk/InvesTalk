import React from "react";
import styles from "./ChatInput.module.css"; // 기존 CSS 모듈을 그대로 import

const ChatInput = ({ scrollToTop, showScrollToTop }) => {
  return (
    <div className={styles.group10}>
      <div className={styles.overlap6}>
        <div className={styles.textWrapper19}>채팅채팅채팅채팅</div>
      </div>
      {showScrollToTop && (
        <img
          className={styles.vector2}
          src="https://c.animaapp.com/8Gc7c0uK/img/vector-1.svg"
          alt="vector"
          onClick={() => scrollToTop()}
        />
      )}
    </div>
  );
};

export default ChatInput;

import React from "react";
import styles from "./GptMessage.module.css"; // 기존 CSS 모듈을 그대로 import

const GptMessage = ({ message, time }) => {
  return (
    <div className={styles.group5}>
      <div className={styles.frame11}>
        <div className={styles.textWrapper11}>{message}</div>
      </div>
      <div className={styles.textWrapper13}>{time}</div>
    </div>
  );
};

export default GptMessage;

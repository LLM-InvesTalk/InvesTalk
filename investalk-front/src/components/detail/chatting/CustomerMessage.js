import React from "react";
import styles from "./Chatting.module.css"; // 기존 CSS 모듈을 그대로 import

const CustomerMessage = ({ message, time }) => {
  return (
    <div className={styles.group4}>
      <div className={styles.frame10}>
        <div className={styles.textWrapper11}>{message}</div>
      </div>
      <div className={styles.textWrapper12}>{time}</div>
    </div>
  );
};

export default CustomerMessage;

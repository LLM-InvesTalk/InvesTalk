import React from "react";
import styles from "./GptMessage.module.css";

const GptMessage = ({ message, time, isLoading = false }) => {
  return (
    <div className={styles.group5}>
      <div className={styles.frame11}>
        {isLoading ? (
          <div className={styles.loadingDots}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <div className={styles.textWrapper11}>{message}</div>
        )}
      </div>
      {!isLoading && <div className={styles.textWrapper13}>{time}</div>}
    </div>
  );
};

export default GptMessage;

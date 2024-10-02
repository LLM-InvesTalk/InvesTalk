import React from "react";
import styles from "./ButtonComponent.module.css"; // CSS Module import

const LeftButtonComponent = ({ onClick }) => {
  return (
    <div
      className={styles.group14}
      onClick={onClick}
      style={{ cursor: "pointer", left: "10px", position: "absolute" }} // 왼쪽에 배치
    >
      <div className={styles.overlap8}>
        <div className={styles.ellipse4} style={{ transform: "rotate(180deg)" }}></div> {/* 원형을 회전 */}
        <img
          className={styles.subtract}
          src="https://c.animaapp.com/8Gc7c0uK/img/subtract.svg"
          alt="Subtract"
          style={{ transform: "rotate(180deg)" }} // subtract 이미지를 회전
        />
        <img
          className={styles.vectorLeft} // 왼쪽 방향 화살표를 위한 스타일
          src="https://c.animaapp.com/8Gc7c0uK/img/vector-2.svg"
          alt="Vector Left"
        />
      </div>
    </div>
  );
};

export default LeftButtonComponent;

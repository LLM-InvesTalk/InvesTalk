import React from "react";
import styles from "./PieChartMessage.module.css"; // 기존 CSS 모듈 import

const PieChartMessage = () => {
  return (
    <div className={styles.group6}>
      <div className={styles.frame13}>
        <div className={styles.frame14}>
          <div className={styles.group7}>
            <div className={styles.overlapGroup2}>
              <img
                className={styles.ellipse}
                src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-72.svg"
                alt="ellipse 72"
              />
              <img
                className={styles.ellipse2}
                src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-73.svg"
                alt="ellipse 73"
              />
              <img
                className={styles.ellipse3}
                src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-74.svg"
                alt="ellipse 74"
              />
            </div>
          </div>
          <MenuList />
        </div>
      </div>
      <div className={styles.frame12}>
        <p className={styles.p}>파이차트용 메세지에요</p>
      </div>
      <div className={styles.textWrapper15}>00:00</div>
    </div>
  );
};

// 메뉴 리스트 컴포넌트 (PieChartMessage 내부에서 관리)
const MenuList = () => {
  const menuItems = ["항목 01", "항목 02", "항목 03", "항목 04", "항목 05"];
  return (
    <div className={styles.frame15}>
      {menuItems.map((item, index) => (
        <div key={index} className={styles.frame16}>
          <div className={styles[`rectangle${index + 2}`]}></div>
          <div className={styles.textWrapper14}>{item}</div>
        </div>
      ))}
    </div>
  );
};

export default PieChartMessage;

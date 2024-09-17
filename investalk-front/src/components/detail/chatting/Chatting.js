import React from "react";
import styles from "./Chatting.module.css"; // CSS 모듈 import
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일

// 최상위 컴포넌트
const Chatting = () => {
  return (
    <div className={styles.divWrapper}>
      <div className={styles.overlapGroupWrapper}>
        <div className={styles.overlap4}>
          <div className={styles.group3}>
            {/* 첫 번째 채팅 그룹 */}
            <div className={styles.group4}>
              <div className={styles.frame10}>
                <div className={styles.textWrapper11}>채팅채팅채팅채팅</div>
              </div>
              <div className={styles.textWrapper12}>00:00</div>
            </div>
            {/* 두 번째 채팅 그룹 */}
            <div className={styles.group5}>
              <div className={styles.frame11}>
                <div className={styles.textWrapper11}>채팅채팅채팅채팅</div>
              </div>
              <div className={styles.textWrapper13}>00:00</div>
            </div>
            {/* 채팅 세부 내용 */}
            <ChatDetails />
            {/* 추가적인 설명 포함 */}
            <ChatExtraDetails />
          </div>
          <div className={styles.textWrapper18}>Assistalk</div>
          {/* 하단 채팅 입력란 */}
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

// 채팅 세부 사항 컴포넌트
const ChatDetails = () => {
  return (
    <div className={styles.group6}>
      <div className={styles.frame12}>
        <p className={styles.p}>
          다음은 ~~에 대한 설명입니다. 주절주절블라블라에 대한 주절주절을 어쩌구중입니다.
        </p>
      </div>
      <div className={styles.frame13}>
        <div className={styles.frame14}>
          <div className={styles.group7}>
            <div className={styles.overlapGroup2}>
              <img className={styles.ellipse} src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-72.svg" alt="ellipse 72" />
              <img className={styles.ellipse2} src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-73.svg" alt="ellipse 73" />
              <img className={styles.ellipse3} src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-74.svg" alt="ellipse 74" />
            </div>
          </div>
          <MenuList />
        </div>
      </div>
      <div className={styles.textWrapper15}>00:00</div>
    </div>
  );
};

// 추가적인 설명이 포함된 채팅 컴포넌트
const ChatExtraDetails = () => {
  return (
    <div className={styles.overlap5}>
      <div className={styles.group8}>
        <div className={styles.frame17}>
          <p className={styles.p}>
            다음은 ~~에 대한 설명입니다. 주절주절블라블라에 대한 주절주절을 어쩌구중입니다.
          </p>
        </div>
        <img className={styles.frame18} src="https://c.animaapp.com/8Gc7c0uK/img/frame-141.svg" alt="frame 141" />
        <div className={styles.textWrapper16}>00:00</div>
      </div>
      <div className={styles.group9}>
        <div className={styles.frame19}>
          <p className={styles.p}>대충 채팅창의 최대 너비는 이 정도라고 생각하시면 될 듯 합니다.</p>
        </div>
        <div className={styles.textWrapper17}>00:00</div>
      </div>
      <div className={styles.rectangle7}></div>
      <div className={styles.rectangle8}></div>
    </div>
  );
};

// 메뉴 리스트 컴포넌트
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

// 하단 채팅 입력창 컴포넌트
const ChatInput = () => {
  return (
    <div className={styles.group10}>
      <div className={styles.overlap6}>
        <div className={styles.textWrapper19}>채팅채팅채팅채팅</div>
      </div>
      <img className={styles.vector2} src="https://c.animaapp.com/8Gc7c0uK/img/vector-1.svg" alt="vector" />
    </div>
  );
};

export default Chatting;

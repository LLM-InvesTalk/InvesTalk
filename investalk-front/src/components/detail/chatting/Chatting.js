import React from "react";
import "./Chatting.css"; // 기존 CSS 스타일을 여기에 추가
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일

// 최상위 컴포넌트
const Chatting = () => {
  return (
    <div className="div-wrapper">
      <div className="overlap-group-wrapper">
        <div className="overlap-4">
          <div className="group-3">
            {/* 첫 번째 채팅 그룹 */}
            <div className="group-4">
              <div className="frame-10">
                <div className="text-wrapper-11">채팅채팅채팅채팅</div>
              </div>
              <div className="text-wrapper-12">00:00</div>
            </div>
            {/* 두 번째 채팅 그룹 */}
            <div className="group-5">
              <div className="frame-11">
                <div className="text-wrapper-11">채팅채팅채팅채팅</div>
              </div>
              <div className="text-wrapper-13">00:00</div>
            </div>
            {/* 채팅 세부 내용 */}
            <ChatDetails />
            {/* 추가적인 설명 포함 */}
            <ChatExtraDetails />
          </div>
          <div className="text-wrapper-18">Assistalk</div>
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
    <div className="group-6">
      <div className="frame-12">
        <p className="p">
          다음은 ~~에 대한 설명입니다. 주절주절블라블라에 대한 주절주절을 어쩌구중입니다.
        </p>
      </div>
      <div className="frame-13">
        <div className="frame-14">
          <div className="group-7">
            <div className="overlap-group-2">
              <img className="ellipse" src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-72.svg" alt="ellipse 72" />
              <img className="ellipse-2" src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-73.svg" alt="ellipse 73" />
              <img className="ellipse-3" src="https://c.animaapp.com/8Gc7c0uK/img/ellipse-74.svg" alt="ellipse 74" />
            </div>
          </div>
          <MenuList />
        </div>
      </div>
      <div className="text-wrapper-15">00:00</div>
    </div>
  );
};

// 추가적인 설명이 포함된 채팅 컴포넌트
const ChatExtraDetails = () => {
  return (
    <div className="overlap-5">
      <div className="group-8">
        <div className="frame-17">
          <p className="p">
            다음은 ~~에 대한 설명입니다. 주절주절블라블라에 대한 주절주절을 어쩌구중입니다.
          </p>
        </div>
        <img className="frame-18" src="https://c.animaapp.com/8Gc7c0uK/img/frame-141.svg" alt="frame 141" />
        <div className="text-wrapper-16">00:00</div>
      </div>
      <div className="group-9">
        <div className="frame-19">
          <p className="p">대충 채팅창의 최대 너비는 이 정도라고 생각하시면 될 듯 합니다.</p>
        </div>
        <div className="text-wrapper-17">00:00</div>
      </div>
      <div className="rectangle-7"></div>
      <div className="rectangle-8"></div>
    </div>
  );
};

// 메뉴 리스트 컴포넌트
const MenuList = () => {
  const menuItems = ["항목 01", "항목 02", "항목 03", "항목 04", "항목 05"];
  return (
    <div className="frame-15">
      {menuItems.map((item, index) => (
        <div key={index} className="frame-16">
          <div className={`rectangle-${index + 2}`}></div>
          <div className="text-wrapper-14">{item}</div>
        </div>
      ))}
    </div>
  );
};

// 하단 채팅 입력창 컴포넌트
const ChatInput = () => {
  return (
    <div className="group-10">
      <div className="overlap-6">
        <div className="text-wrapper-19">채팅채팅채팅채팅</div>
      </div>
      <img className="vector-2" src="https://c.animaapp.com/8Gc7c0uK/img/vector-1.svg" alt="vector" />
    </div>
  );
};

export default Chatting;

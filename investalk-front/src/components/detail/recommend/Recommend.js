import React from 'react';
import './Recommend.css'; // CSS는 외부 파일로 분리
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일

const Recommend = () => {
  const sectors = ['IT', 'Software', 'Retail', 'Utilities', 'Fashion'];
  const numbers = ['01.', '02.', '03.', '04.', '05.'];

  return (
    <div className="div-wrapper">
      <div className="group-11">
        <div className="overlap-7">
          <div className="group-12">
            <div className="overlap-group-3">
              <img
                className="group-13"
                src="https://c.animaapp.com/8Gc7c0uK/img/group@2x.png"
                alt="Group"
              />
              <div className="frame-20">
                <div className="frame-21">
                  <div className="text-wrapper-20">추천</div>
                  <div className="frame-22">
                    <div className="text-wrapper-21">섹터</div>
                    <div className="text-wrapper-22">·</div>
                    <div className="text-wrapper-23">섹터 비율</div>
                  </div>
                </div>
                <div className="frame-23">
                  <div className="frame-24">
                    {numbers.map((num, index) => (
                      <div key={index} className="text-wrapper-24">{num}</div>
                    ))}
                  </div>
                  <div className="frame-24">
                    {sectors.map((sector, index) => (
                      <div key={index} className="text-wrapper-26">{sector}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="group-14">
            <div className="overlap-8">
              <div className="ellipse-4"></div>
              <img
                className="subtract"
                src="https://c.animaapp.com/8Gc7c0uK/img/subtract.svg"
                alt="Subtract"
              />
              <img
                className="vector-3"
                src="https://c.animaapp.com/8Gc7c0uK/img/vector-2.svg"
                alt="Vector"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend;

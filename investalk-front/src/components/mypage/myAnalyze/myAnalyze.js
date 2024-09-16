import React from "react";
import "./myAnalyze.css"; // CSS 파일은 별도로 관리한다고 가정합니다.
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일

const myAnalyze = () => {
  return (
    <div className="div-wrapper"> {/* 상위 요소에 div-wrapper 클래스를 추가 */}
      <div className="group-2">
        {/* 이미지 부분 */}
        <img className="vector" src="https://c.animaapp.com/99LNnW64/img/vector-26.svg" alt="Vector Icon" />

        <div className="group-3">
          {/* 자산 설명 텍스트 */}
          <p className="element">
            000님의 보유 자산은 ~~ 하고 ~~ 되고 있습니다. ~~~~~~~~~~~~~~~~~~~~~~<br />
            블라블라블라블라...<br />
            000님의 보유 자산은 ~~ 하고 ~~ 되고 있습니다.
          </p>

          <div className="overlap-group-2">
            {/* 겹쳐진 이미지들 */}
            <img className="burst-pucker-4" src="https://c.animaapp.com/99LNnW64/img/burst-pucker-2-3.svg" alt="Pucker Icon 1" />
            <img className="burst-pucker-5" src="https://c.animaapp.com/99LNnW64/img/burst-pucker-2-4.svg" alt="Pucker Icon 2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default myAnalyze;

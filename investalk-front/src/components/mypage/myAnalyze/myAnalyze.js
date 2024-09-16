import React from "react";
import styles from "./myAnalyze.module.css"; // CSS Modules를 사용한 스타일 임포트
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일

const myAnalyze = () => {
  return (
    <div className={styles.divWrapper}> {/* 클래스 네임 변경 */}
      <div className={styles.group2}>
        {/* 이미지 부분 */}
        <img className={styles.vector} src="https://c.animaapp.com/99LNnW64/img/vector-26.svg" alt="Vector Icon" />

        <div className={styles.group3}>
          {/* 자산 설명 텍스트 */}
          <p className={styles.element}>
            000님의 보유 자산은 ~~ 하고 ~~ 되고 있습니다. ~~~~~~~~~~~~~~~~~~~~~~<br />
            블라블라블라블라...<br />
            000님의 보유 자산은 ~~ 하고 ~~ 되고 있습니다.
          </p>

          <div className={styles.overlapGroup2}>
            {/* 겹쳐진 이미지들 */}
            <img className={styles.burstPucker4} src="https://c.animaapp.com/99LNnW64/img/burst-pucker-2-3.svg" alt="Pucker Icon 1" />
            <img className={styles.burstPucker5} src="https://c.animaapp.com/99LNnW64/img/burst-pucker-2-4.svg" alt="Pucker Icon 2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default myAnalyze;

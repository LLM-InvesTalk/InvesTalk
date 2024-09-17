import React from 'react';
import styles from './Recommend.module.css'; // CSS 모듈 import
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일

const Recommend = () => {
  const sectors = ['IT', 'Software', 'Retail', 'Utilities', 'Fashion'];
  const numbers = ['01.', '02.', '03.', '04.', '05.'];

  return (
    <div className={styles.divWrapper}>
      <div className={styles.group11}>
        <div className={styles.overlap7}>
          <div className={styles.group12}>
            <div className={styles.overlapGroup3}>
              <img
                className={styles.group13}
                src="https://c.animaapp.com/8Gc7c0uK/img/group@2x.png"
                alt="Group"
              />
              <div className={styles.frame20}>
                <div className={styles.frame21}>
                  <div className={styles.textWrapper20}>추천</div>
                  <div className={styles.frame22}>
                    <div className={styles.textWrapper21}>섹터</div>
                    <div className={styles.textWrapper22}>·</div>
                    <div className={styles.textWrapper23}>섹터 비율</div>
                  </div>
                </div>
                <div className={styles.frame23}>
                  <div className={styles.frame24}>
                    {numbers.map((num, index) => (
                      <div key={index} className={styles.textWrapper24}>{num}</div>
                    ))}
                  </div>
                  <div className={styles.frame24}>
                    {sectors.map((sector, index) => (
                      <div key={index} className={styles.textWrapper26}>{sector}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.group14}>
            <div className={styles.overlap8}>
              <div className={styles.ellipse4}></div>
              <img
                className={styles.subtract}
                src="https://c.animaapp.com/8Gc7c0uK/img/subtract.svg"
                alt="Subtract"
              />
              <img
                className={styles.vector3}
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

import React, { useState } from 'react';
import styles from './NewsRecommend.module.css'; // CSS Module import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import SectorRecommend from './SectorRecommend'; // SectorRecommend 컴포넌트 import

const NewsRecommend = () => {
  // 상태를 사용하여 현재 컴포넌트를 전환
  const [isSector, setIsSector] = useState(false);

  // 클릭 시 SectorRecommend로 전환하는 함수
  const handleSwitchToSector = () => {
    setIsSector(true);
  };

  // 현재 상태에 따라 렌더링할 컴포넌트 결정
  if (isSector) {
    return <SectorRecommend />;
  }

  return (
    <div className={styles.newsRecommend}>
      <div className={styles.titleWrapper}>
        <div className={styles.titleContainer}>
          <div className={styles.titleMain}>추천</div>
          <div className={styles.titleSub}>뉴스 추천</div>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <img
          className={styles.backgroundImage}
          src="https://c.animaapp.com/8Gc7c0uK/img/group@2x.png"
          alt="뉴스 추천"
        />
        <div className={styles.newsList}>
          <div className={styles.newsItem}>
            <p className={styles.newsText}>Credit’s Strong Run Stumbles for First Time This Year</p>
            <div className={styles.newsTime}>4 hours ago</div>
          </div>
          <div className={styles.newsItem}>
            <p className={styles.newsText}>Credit’s Strong Run Stumbles for First Time This Year</p>
            <div className={styles.newsTime}>4 hours ago</div>
          </div>
          <div className={styles.newsItem}>
            <p className={styles.newsText}>Credit’s Strong Run Stumbles for First Time This Year</p>
            <div className={styles.newsTime}>4 hours ago</div>
          </div>
        </div>
      </div>
      
      {/* SectorRecommend로 이동하는 버튼 */}
      <div className={styles.group14} onClick={handleSwitchToSector} style={{ cursor: 'pointer' }}>
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
  );
};

export default NewsRecommend;

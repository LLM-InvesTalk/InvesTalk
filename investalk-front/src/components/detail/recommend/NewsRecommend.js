import React from 'react';
import styles from './NewsRecommend.module.css'; // CSS Module import
import "../css/DetailGlobals.css"; // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일

const NewsRecommend = () => {
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
    </div>
  );
};

export default NewsRecommend;

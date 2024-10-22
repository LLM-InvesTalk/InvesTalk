import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import styles from './SectorRecommend.module.css'; // CSS 모듈 import
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import EnterpriseRecommend from './EnterpriseRecommend'; // 새로운 컴포넌트 import
import NewsRecommend from './NewsRecommend'; // 새로운 컴포넌트 import (추가)
import ButtonComponent from './Button/ButtonComponent'; // 오른쪽 버튼 컴포넌트 import
import LeftButtonComponent from './Button/LeftButtonComponent'; // 왼쪽 버튼 컴포넌트 import

const Recommend = () => {
  const [sectors, setSectors] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isEnterprise, setIsEnterprise] = useState(false); // 오른쪽 버튼 상태
  const [isNews, setIsNews] = useState(false); // 왼쪽 버튼 상태 추가

  // .env에서 Flask API URL 가져오기
  const API_URL = process.env.REACT_APP_FLASK_API_URL;

  useEffect(() => {
    // Flask API 호출
    axios.get(`${API_URL}/api/recommend-sectors`)
      .then(response => {
        const { similar_sectors } = response.data;
        setSectors(similar_sectors);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sectors:', error);
        setError('섹터 데이터를 가져오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [API_URL]);

  // 컴포넌트 전환 함수 (오른쪽 버튼)
  const handleSwitchEnterprise = () => {
    setIsEnterprise((prev) => !prev); // Enterprise 상태 토글
    setIsNews(false); // News는 꺼짐
  };

  // 컴포넌트 전환 함수 (왼쪽 버튼)
  const handleSwitchNews = () => {
    setIsNews((prev) => !prev); // News 상태 토글
    setIsEnterprise(false); // Enterprise는 꺼짐
  };

  const numbers = ['01.', '02.', '03.', '04.', '05.'];

  return (
    <div className={styles.divWrapper}>
      {isNews ? (
        // 왼쪽 버튼을 누르면 NewsRecommend 컴포넌트 표시
        <NewsRecommend />
      ) : isEnterprise ? (
        // 오른쪽 버튼을 누르면 EnterpriseRecommend 컴포넌트 표시
        <EnterpriseRecommend />
      ) : (
        // 기본적으로 Recommend 컴포넌트 표시
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
                      {loading ? (
                        <div>Loading...</div> // 로딩 중일 때 섹터 데이터 대신 "Loading..." 표시
                      ) : error ? (
                        <div className={styles.errorMessage}>{error}</div> // 에러 발생 시 에러 메시지 표시
                      ) : (
                        sectors.map((sector, index) => (
                          <div key={index} className={styles.textWrapper26}>{sector}</div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 왼쪽 버튼 추가 (NewsRecommend로 전환) */}
            <LeftButtonComponent onClick={handleSwitchNews} />
            {/* 오른쪽 버튼 추가 (EnterpriseRecommend로 전환) */}
            <ButtonComponent onClick={handleSwitchEnterprise} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;

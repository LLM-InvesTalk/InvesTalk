import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SectorRecommend.module.css'; // CSS 모듈 import
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import EnterpriseRecommend from './EnterpriseRecommend'; // 새로운 컴포넌트 import
import NewsRecommend from './NewsRecommend'; // 새로운 컴포넌트 import (수정된 버전)
import ButtonComponent from './Button/ButtonComponent'; // 오른쪽 버튼 컴포넌트 import
import LeftButtonComponent from './Button/LeftButtonComponent'; // 왼쪽 버튼 컴포넌트 import
import LoadingAnimation from '../../loading/LoadingAnimation';

const Recommend = (props) => {
  // FinancialStatements처럼 tickerSymbol을 props로 받음
  const { tickerSymbol } = props;  // <-- 티커심볼을 받아옴

  const [sectors, setSectors] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isEnterprise, setIsEnterprise] = useState(false); // 오른쪽 버튼 상태
  const [isNews, setIsNews] = useState(false); // 왼쪽 버튼 상태

  // .env에서 Flask API URL 가져오기
  const API_URL = process.env.REACT_APP_FLASK_API_URL;

  useEffect(() => {
    // tickerSymbol이 존재할 때만 API 호출
    if (!tickerSymbol) {
      return;
    }

    // URL의 끝에 슬래시가 있으면 제거
    const baseUrl = API_URL.endsWith('/')
      ? API_URL.slice(0, -1)
      : API_URL;

    const finalUrl = `${baseUrl}/api/recommend-sectors/${tickerSymbol}`;
    console.log("Final request URL:", finalUrl);

    // 로딩 상태 true로 세팅
    setLoading(true);

    axios.get(finalUrl)
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
  }, [API_URL, tickerSymbol]); 
  // **의존성 배열에 tickerSymbol 포함** -> 검색 심볼 변경 시 재호출

  // 컴포넌트 전환 함수 (오른쪽 버튼 - Enterprise)
  const handleSwitchEnterprise = () => {
    setIsEnterprise((prev) => !prev); 
    setIsNews(false);
  };

  // 컴포넌트 전환 함수 (왼쪽 버튼 - News)
  const handleSwitchNews = () => {
    setIsNews((prev) => !prev); 
    setIsEnterprise(false);
  };

  const numbers = ['01.', '02.', '03.', '04.', '05.'];

  return (
    <div className={styles.divWrapper}>
      {isNews ? (
        // 왼쪽 버튼을 누르면 NewsRecommend 컴포넌트 표시
        <NewsRecommend tickerSymbol={tickerSymbol} />
      ) : isEnterprise ? (
        // 오른쪽 버튼을 누르면 EnterpriseRecommend 컴포넌트 표시
        <EnterpriseRecommend tickerSymbol={tickerSymbol}/>
      ) : (
        // 기본적으로 SectorRecommend 내용 표시
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
                        <div key={index} className={styles.textWrapper24}>
                          {num}
                        </div>
                      ))}
                    </div>
                    <div className={styles.frame24}>
                      {loading ? (
                        <div style={{
                          position: 'relative',
                          top: '50%',
                          left: '115px',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1000
                        }}>
                          <LoadingAnimation />
                        </div>
                      ) : error ? (
                        <div className={styles.errorMessage}>{error}</div>
                      ) : (
                        sectors.map((sector, index) => (
                          <div key={index} className={styles.textWrapper26}>
                            {sector}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 왼쪽 버튼 (NewsRecommend로 전환) */}
            <LeftButtonComponent onClick={handleSwitchNews} />
            {/* 오른쪽 버튼 (EnterpriseRecommend로 전환) */}
            <ButtonComponent onClick={handleSwitchEnterprise} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommend;

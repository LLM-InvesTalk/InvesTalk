<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
=======
import React, { useState } from 'react';
>>>>>>> 7a2946f (✨ 추천.버튼 클릭시 다른 추천 컴포넌트로 변경되도록 추가)
import styles from './SectorRecommend.module.css'; // CSS 모듈 import
import "../css/DetailGlobals.css";   // 글로벌 스타일
import "../css/DetailStyleguide.css"; // 추천 섹터 스타일
import EnterpriseRecommend from './EnterpriseRecommend'; // 새로운 컴포넌트 import

const Recommend = () => {
<<<<<<< HEAD
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

=======
  // 상태를 사용하여 현재 컴포넌트를 제어
  const [isEnterprise, setIsEnterprise] = useState(false);

  // 섹터 정보
  const sectors = ['IT', 'Software', 'Retail', 'Utilities', 'Fashion'];
>>>>>>> 7a2946f (✨ 추천.버튼 클릭시 다른 추천 컴포넌트로 변경되도록 추가)
  const numbers = ['01.', '02.', '03.', '04.', '05.'];

  // 컴포넌트 전환 함수
  const handleSwitchComponent = () => {
    setIsEnterprise((prev) => !prev); // 버튼을 누를 때마다 상태를 토글
  };

  return (
    <div className={styles.divWrapper}>
      {isEnterprise ? (
        // 상태가 true면 EnterpriseRecommend 컴포넌트 표시
        <EnterpriseRecommend />
      ) : (
        // 상태가 false면 기존 Recommend 컴포넌트 표시
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
                  onClick={handleSwitchComponent} // 버튼 클릭 시 컴포넌트 교체
                  style={{ cursor: 'pointer' }} // 버튼처럼 보이게 커서 스타일 추가
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
      )}
    </div>
  );
};

export default Recommend;

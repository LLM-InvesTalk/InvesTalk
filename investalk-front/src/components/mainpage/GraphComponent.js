import React from 'react';
import '../styles/GraphComponentStyle.css';
import '../styles/globals.css';
import '../styles/styleguide.css';

// 어제와 오늘의 데이터 배열
const yesterdayData = [100, 120, 80, 150, 90, 130, 70, 300, 100, 40]; // 어제의 데이터 값
const todayData = [200, 80, 60, 150, 50, 130, 90, 200, 180, 70]; // 오늘의 데이터 값
const barMaxHeight = 200; // 막대의 최대 높이를 200px로 설정
const yesterdayHeight = 100; // 기준선을 100px로 설정하여 그래프 중앙에 위치시킴

export default function DynamicBarChart() {
    return (
        <div className="overlap">
            <div className="group-wrapper">
                <div className="group-2">
                    <div className="frame">
                        <div className="text-wrapper-12">Now World Is...</div>
                        <div className="text-description">
                            Text Description...<br />......................................................................................<br />..................................................................
                        </div>
                    </div>
                    <div className="group-3">
                        <div className="overlap-group-wrapper" style={{ display: 'flex', justifyContent: 'space-around', height: `${barMaxHeight}px`, position: 'relative' }}>
                            <div class="rectangle-2"></div>
                            {todayData.map((todayValue, index) => {
                                const yesterdayValue = yesterdayData[index]; // 각 바의 어제 데이터 값
                                const barHeight = (todayValue / yesterdayValue) * yesterdayHeight; // 어제 값을 기준으로 오늘 값의 상대적 비율 계산
                                const isIncreased = todayValue >= yesterdayValue; // 오늘 값이 어제보다 큰지 여부 확인
                                const gradient = isIncreased
                                    ? 'linear-gradient(180deg, rgb(171.59, 179.93, 255) 0%, rgb(182.75, 237.66, 255) 58%, rgb(176.91, 255, 226.89) 100%)' // 증가한 경우 색상
                                    : 'linear-gradient(360deg, rgb(234.7, 255, 176.91) 0%, rgb(255, 226.1, 182.75) 32%, rgb(255, 171.59, 211.63) 100%)'; // 감소한 경우 색상

                                return (
                                    <div key={index} style={{ position: 'relative', width: '50px', height: `${barMaxHeight}px`, display: 'flex', justifyContent: 'center' }}>
                                        {/* Bar */}
                                        <div
                                            className="bar"
                                            style={{
                                                height: `${barHeight}px`, // 오늘 값에 따른 막대 높이 설정
                                                background: gradient,
                                                width: '21px',
                                                position: 'absolute',
                                                bottom: '14px',
                                                left: '13px',
                                                borderRadius: '22.39px',
                                            }}
                                        ></div>

                                        {/* 나라이름 텍스트 */}
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '-14px',
                                                width: '100%',
                                                height: 'auto',
                                                color: '#38465a',
                                                fontSize: '12px',
                                                textAlign: 'center',
                                                whiteSpace: 'nowrap',
                                                fontFamily: '"Pretendard Variable-Regular", Helvetica',
                                                fontWeight: '400',
                                                letterSpacing: '0',
                                                lineHeight: 'normal'
                                            }}>
                                            나라이름
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-wrapper-11">Yesterday (100%)</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import styles from './GraphComponentStyle.module.css';

export default function DynamicBarChart() {
    const [etfData, setEtfData] = useState({});
    const [hoveredIndex, setHoveredIndex] = useState(null); // 마우스 오버한 막대의 인덱스
    const [hoveredChange, setHoveredChange] = useState(null); // 마우스 오버한 퍼센트 포인트
    const API_URL = process.env.REACT_APP_FLASK_API_URL;

    useEffect(() => {
        const fetchEtfData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/etf-data`);
                const data = await response.json();
                setEtfData(data);
            } catch (error) {
                console.error('Error fetching ETF data:', error);
            }
        };
        fetchEtfData();
    }, [API_URL]);

    const barMaxHeight = 200;

    return (
        <div className={styles['div-wrapper']}>
            <div className={styles['overlap']}>
                <div className={styles['group-wrapper']}>
                    <div className={styles['group-2']}>
                        <div className={styles['frame']}>
                            <div className={styles['text-wrapper-12']}>Now World Is...</div>
                            <div className={styles['text-description']}>
                                Text Description...<br />......................................................................................<br />..................................................................
                            </div>
                        </div>
                        <div className={styles['group-3']}>
                            <div className={styles['overlap-group-wrapper']} style={{ display: 'flex', justifyContent: 'space-around', height: `${barMaxHeight}px`, position: 'relative' }}>
                                <div className={styles['rectangle-2']}></div>
                                {Object.keys(etfData).map((symbol, index) => {
                                    const etf = etfData[symbol];
                                    const todayValue = etf.today_price;
                                    const yesterdayValue = etf.yesterday_price;

                                    const percentageChange = ((todayValue - yesterdayValue) / yesterdayValue) * 100;
                                    const barHeight = Math.abs((percentageChange / 3) * 100);  // -5% ~ 5% 범위
                                    const isPositiveChange = percentageChange >= 0;

                                    const gradient = isPositiveChange
                                        ? 'linear-gradient(180deg, rgb(171.59, 179.93, 255) 0%, rgb(182.75, 237.66, 255) 58%, rgb(176.91, 255, 226.89) 100%)'
                                        : 'linear-gradient(rgb(234.7, 255, 176.91) 0%, rgb(255, 226.1, 182.75) 32%, rgb(255, 171.59, 211.63) 100%)';

                                    return (
                                        <div
                                            key={index}
                                            style={{ position: 'relative', width: '50px', display: 'flex', justifyContent: 'center' }}
                                            onMouseEnter={() => {
                                                setHoveredIndex(index);
                                                setHoveredChange(percentageChange.toFixed(2));  // 소수점 2자리까지 표시
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredIndex(null);
                                                setHoveredChange(null);
                                            }}
                                        >
                                            <div
                                                className={styles['bar']}
                                                style={{
                                                    height: `${barHeight}px`,
                                                    background: gradient,
                                                    width: '21px',
                                                    position: 'absolute',
                                                    bottom: isPositiveChange ? `calc(50% + 14px)` : `calc(50% - ${barHeight}px + 14px)`,
                                                    borderRadius: '22.39px',
                                                }}
                                            ></div>

                                            {/* 툴팁 */}
                                            {hoveredIndex === index && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: isPositiveChange ? `calc(50% + ${barHeight}px + 20px)` : `calc(50% - ${barHeight}px - 20px)`,
                                                        padding: '5px',
                                                        borderRadius: '5px',
                                                        fontFamily: '"Pretendard Variable-Bold", Helvetica',
                                                        fontSize: '10px',
                                                        color: isPositiveChange ? 'rgb(171.59, 179.93, 255)' : 'rgb(255, 171.59, 211.63)',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {hoveredChange}% {isPositiveChange ? '상승' : '하락'}
                                                </div>
                                            )}

                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-14px',
                                                    width: '100%',
                                                    height: 'auto',
                                                    color: '#38465a',
                                                    fontSize: '10px',
                                                    textAlign: 'center',
                                                    whiteSpace: 'nowrap',
                                                    fontFamily: '"Pretendard Variable-Regular", Helvetica',
                                                    fontWeight: '400',
                                                    letterSpacing: '0',
                                                    lineHeight: 'normal'
                                                }}
                                            >
                                                {symbol}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={styles['text-wrapper-11']}>Yesterday (100%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

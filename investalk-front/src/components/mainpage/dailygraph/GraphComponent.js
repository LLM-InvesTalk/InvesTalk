import React from 'react';
import styles from './GraphComponentStyle.module.css';  // 모듈화된 스타일 통합

const yesterdayData = [100, 120, 80, 150, 90, 130, 70, 300, 100, 40];
const todayData = [200, 80, 60, 150, 50, 130, 90, 200, 180, 70];
const barMaxHeight = 200;
const yesterdayHeight = 100;

export default function DynamicBarChart() {
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
                                {todayData.map((todayValue, index) => {
                                    const yesterdayValue = yesterdayData[index];
                                    const barHeight = (todayValue / yesterdayValue) * yesterdayHeight;
                                    const isIncreased = todayValue >= yesterdayValue;
                                    const gradient = isIncreased
                                        ? 'linear-gradient(180deg, rgb(171.59, 179.93, 255) 0%, rgb(182.75, 237.66, 255) 58%, rgb(176.91, 255, 226.89) 100%)'
                                        : 'linear-gradient(360deg, rgb(234.7, 255, 176.91) 0%, rgb(255, 226.1, 182.75) 32%, rgb(255, 171.59, 211.63) 100%)';

                                    return (
                                        <div key={index} style={{ position: 'relative', width: '50px', height: `${barMaxHeight}px`, display: 'flex', justifyContent: 'center' }}>
                                            <div
                                                className={styles['bar']}
                                                style={{
                                                    height: `${barHeight}px`,
                                                    background: gradient,
                                                    width: '21px',
                                                    position: 'absolute',
                                                    bottom: '14px',
                                                    left: '13px',
                                                    borderRadius: '22.39px',
                                                }}
                                            ></div>
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
                            <div className={styles['text-wrapper-11']}>Yesterday (100%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

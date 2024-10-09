import React, { useState } from 'react';
import styles from './TableComponentStyle.module.css';  // CSS 모듈로 가져옴

const yesterdayData = {
    'AAPL': { 등락폭: '2%', 안전성: '5.3점' },
    'SSNLF': { 등락폭: '2%', 안전성: '4.5점' },
    'GOOGL': { 등락폭: '4%', 안전성: '6.0점' },
    'TSLA': { 등락폭: '3%', 안전성: '5.0점' },
    'MSFT': { 등락폭: '5%', 안전성: '4.9점' },
};

const todayData = [
    { 종목: 'AAPL', 등락폭: '3%', 안전성: '5.5점', 실적발표날짜: '2024년 8월 21일', 희망가격: '300$', ai기준가능성: '80%' },
    { 종목: 'SSNLF', 등락폭: '1%', 안전성: '4.2점', 실적발표날짜: '2023년 7월 15일', 희망가격: '250$', ai기준가능성: '75%' },
    { 종목: 'GOOGL', 등락폭: '5%', 안전성: '6.1점', 실적발표날짜: '2024년 10월 1일', 희망가격: '500$', ai기준가능성: '90%' },
    { 종목: 'TSLA', 등락폭: '2%', 안전성: '4.8점', 실적발표날짜: '2023년 12월 12일', 희망가격: '400$', ai기준가능성: '85%' },
    { 종목: 'MSFT', 등락폭: '4%', 안전성: '5.0점', 실적발표날짜: '2024년 6월 20일', 희망가격: '350$', ai기준가능성: '78%' },
];

const TableComponent = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? '△' : '▽';
        }
        return '▽';
    };


    const getClassForChange = (direction) => {
        if (direction === "up") {
            return styles['text-wrapper-4']; // 상승
        } else {
            return styles['text-wrapper-6']; // 하락 또는 변동 없음
        }
    };

    const sortedData = [...todayData].sort((a, b) => {
        if (sortConfig.key) {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];

            if (sortConfig.key !== '종목' && sortConfig.key !== '실적발표날짜') {
                const numA = parseFloat(valueA.replace('%', '').replace('$', ''));
                const numB = parseFloat(valueB.replace('%', '').replace('$', ''));
                return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
            }

            return sortConfig.direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }
        return 0;
    });

    return (
        <div className={styles['div-wrapper']}>
            <div className={styles['frame-wrapper']}>
                <div className={styles['frame']}>
                    <div className={styles['frame-2']}>
                        <p className={styles['p']}>
                            <span className={styles['text-wrapper']}>종목</span>
                            <span
                                className={`${styles['span']} ${styles['arrow']}`}
                                onClick={() => handleSort('종목')}
                            >
                                {getArrow('종목')}
                            </span>
                        </p>
                        <div className={styles['frame-3']}>
                            {sortedData.map((item, index) => (
                                <div key={index} className={styles['text-wrapper-2']}>{item.종목}</div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['frame-4']}>
                        <p className={styles['div-2']}>
                            <span className={styles['text-wrapper']}>그래프</span>
                        </p>
                        <div className={styles['frame-5']}>
                            {sortedData.map((_, index) => (
                                <div key={index} className={styles['rectangle-2']}></div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['frame-6']}>
                        <p className={styles['div-3']}>
                            <span className={styles['text-wrapper']}>등락폭</span>
                            <span
                                className={`${styles['span']} ${styles['arrow']}`}
                                onClick={() => handleSort('등락폭')}
                            >
                                {getArrow('등락폭')}
                            </span>
                        </p>
                        <div className={styles['frame-7']}>
                            {sortedData.map((item, index) => {
                                const yesterdayValue = yesterdayData[item.종목].등락폭;
                                return (
                                    <div
                                        key={index}
                                        className={getClassForChange(item.등락폭, yesterdayValue)}
                                    >
                                        {item.등락폭}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles['frame-8']}>
                        <p className={styles['div-4']}>
                            <span className={styles['text-wrapper']}>안전성</span>
                            <span
                                className={`${styles['span']} ${styles['arrow']}`}
                                onClick={() => handleSort('안전성')}
                            >
                                {getArrow('안전성')}
                            </span>
                        </p>
                        <div className={styles['frame-3']}>
                            {sortedData.map((item, index) => {
                                const yesterdayValue = yesterdayData[item.종목].안전성;
                                return (
                                    <div
                                        key={index}
                                        className={getClassForChange(item.안전성, yesterdayValue)}
                                    >
                                        {item.안전성}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles['frame-9']}>
                        <p className={styles['div-5']}>
                            <span className={styles['text-wrapper']}>실적발표날짜</span>
                            <span
                                className={`${styles['span']} ${styles['arrow']}`}
                                onClick={() => handleSort('실적발표날짜')}
                            >
                                {getArrow('실적발표날짜')}
                            </span>
                        </p>
                        <div className={styles['frame-3']}>
                            {sortedData.map((item, index) => (
                                <div key={index} className={styles['text-wrapper-2']}>{item.실적발표날짜}</div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['frame-10']}>
                        <p className={styles['div-6']}>
                            <span className={styles['text-wrapper']}>나의 희망가격</span>
                            <span
                                className={`${styles['span']} ${styles['arrow']}`}
                                onClick={() => handleSort('희망가격')}
                            >
                                {getArrow('희망가격')}
                            </span>
                        </p>
                        <div className={styles['frame-11']}>
                            {sortedData.map((item, index) => (
                                <div key={index} className={styles['text-wrapper-2']}>{item.희망가격}</div>
                            ))}
                        </div>
                    </div>

                    <div className={styles['frame-10']}>
                        <p className={styles['ai']}>
                            <span className={styles['text-wrapper']}>ai기준가능성</span>
                            <span
                                className={`${styles['span']} ${styles['arrow']}`}
                                onClick={() => handleSort('ai기준가능성')}
                            >
                                {getArrow('ai기준가능성')}
                            </span>
                        </p>
                        <div className={styles['frame-12']}>
                            {sortedData.map((item, index) => (
                                <div key={index} className={styles['text-wrapper-7']}>{item.ai기준가능성}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;

import React, { useEffect, useState } from 'react';
import styles from './GraphComponentStyle.module.css';
import ButtonComponent from './Button/ButtonComponent';
import LeftButtonComponent from './Button/LeftButtonComponent';

export default function DynamicBarChart() {
    const [etfData, setEtfData] = useState([]); // ETF 데이터 상태
    const [offset, setOffset] = useState(0); // 페이지 오프셋 상태
    const [hoveredIndex, setHoveredIndex] = useState(null); // 마우스 오버된 막대의 인덱스
    const [hoveredChange, setHoveredChange] = useState(null); // 마우스 오버된 퍼센트 값
    const [maxChange, setMaxChange] = useState(1); // 최대 변동률 상태
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const FLASK_URL = process.env.REACT_APP_FLASK_URL;

    const barMaxHeight = 200; // 막대 최대 높이

    const countryMapping = [
        { symbol: 'SPY', name: '미국' },
        { symbol: 'EWJ', name: '일본' },
        { symbol: 'EWG', name: '독일' },
        { symbol: 'EWQ', name: '프랑스' },
        { symbol: 'EWC', name: '캐나다' },
        { symbol: 'EWA', name: '호주' },
        { symbol: 'EWU', name: '영국' },
        { symbol: 'EWL', name: '스위스' },
        { symbol: 'EWK', name: '벨기에' },
        { symbol: 'EWD', name: '스웨덴' },
        { symbol: 'EWS', name: '싱가포르' },
        { symbol: 'EWH', name: '홍콩' },
        { symbol: 'EWI', name: '이탈리아' },
        { symbol: 'EWN', name: '네덜란드' },
        { symbol: 'EWP', name: '스페인' },
        { symbol: 'EWO', name: '오스트리아' },
        { symbol: 'EWD', name: '덴마크' },
        { symbol: 'EWY', name: '대한민국' },
        { symbol: 'EWZ', name: '브라질' },
        { symbol: 'EWT', name: '대만' }
    ];

    useEffect(() => {
        const fetchEtfData = async () => {
            try {
                setIsLoading(true); // 로딩 시작
                const response = await fetch(`${FLASK_URL}/api/etf-data?offset=${offset}`);
                const data = await response.json();

                const maxChange = Math.max(
                    ...countryMapping.map(country => {
                        const etf = data[country.symbol];
                        if (!etf || !etf.today_price || !etf.yesterday_price) return 0;
                        const todayValue = etf.today_price;
                        const yesterdayValue = etf.yesterday_price;
                        return Math.abs(((todayValue - yesterdayValue) / yesterdayValue) * 100);
                    }).filter(change => change !== 0) // 값이 0이 아닌 것만 포함
                );

                setEtfData(data);
                setMaxChange(maxChange);
            } catch (error) {
                console.error('Error fetching ETF data:', error);
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchEtfData();
    }, [FLASK_URL, offset]);

    const handleNext = () => {
        if (offset + 10 < countryMapping.length) {
            setOffset(offset + 3); // 3개씩 이동
        }
    };

    const handlePrev = () => {
        if (offset > 0) {
            setOffset(offset - 3); // 3개씩 이동
        }
    };

    return (
        <div className={styles['div-wrapper']}>
            <div className={styles['overlap']}>
                <div className={styles['group-wrapper']}>
                    <div className={styles['group-2']}>
                        <div className={styles['frame']}>
                            <div className={styles['text-wrapper-12']}>Now World Is...</div>
                            <div className={styles['text-description']}>
                                Text Description...<br />
                                ......................................................................................<br />
                                ..................................................................
                            </div>
                        </div>
                        <div className={styles['group-3']} style={{ position: 'relative' }}>


                            <div
                                className={styles['overlap-group-wrapper']}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    height: `${barMaxHeight}px`,
                                    position: 'relative'
                                }}
                            >
                                {/* 그래프 하단 선 */}
                                <div className={styles['rectangle-2']}></div>
                                {isLoading
                                    ? countryMapping.slice(offset, offset + 10).map((_, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                width: '50px',
                                                display: 'flex',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <div
                                                className={styles['bar']}
                                                style={{
                                                    height: '0px', // 로딩 중일 때 막대 높이는 0
                                                    background: 'transparent'
                                                }}
                                            ></div>
                                        </div>
                                    ))
                                    : countryMapping.slice(offset, offset + 10).map((country, index) => {
                                        const etf = etfData[country.symbol];
                                        if (!etf || !etf.today_price || !etf.yesterday_price) return null;

                                        const todayValue = etf.today_price;
                                        const yesterdayValue = etf.yesterday_price;

                                        const percentageChange = ((todayValue - yesterdayValue) / yesterdayValue) * 100;

                                        const barHeight = maxChange > 0
                                            ? (Math.abs(percentageChange) / maxChange) * (barMaxHeight / 2.5)
                                            : 0;

                                        const isPositiveChange = percentageChange >= 0;
                                        const gradient = isPositiveChange
                                            ? 'linear-gradient(180deg, rgb(171.59, 179.93, 255) 0%, rgb(182.75, 237.66, 255) 58%, rgb(176.91, 255, 226.89) 100%)'
                                            : 'linear-gradient(rgb(234.7, 255, 176.91) 0%, rgb(255, 226.1, 182.75) 32%, rgb(255, 171.59, 211.63) 100%)';

                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    position: 'relative',
                                                    width: '50px',
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                                onMouseEnter={() => {
                                                    setHoveredIndex(index);
                                                    setHoveredChange(percentageChange.toFixed(2));
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
                                                            bottom: isPositiveChange
                                                                ? `calc(50% + ${barHeight}px + 20px)`
                                                                : `calc(50% - ${barHeight}px - 20px)`,
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            fontFamily: '"Pretendard Variable-Bold", Helvetica',
                                                            fontSize: '10px',
                                                            color: isPositiveChange
                                                                ? 'rgb(171.59, 179.93, 255)'
                                                                : 'rgb(255, 171.59, 211.63)',
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
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {country.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* 왼쪽 화살표 버튼 */}
                            <div className={styles['left-button']}>
                                <LeftButtonComponent onClick={handlePrev} />
                            </div>

                            {/* 오른쪽 화살표 버튼 */}
                            <div className={styles['right-button']}>
                                <ButtonComponent onClick={handleNext} />
                            </div>
                            <div className={styles['text-wrapper-11']}>Yesterday (100%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

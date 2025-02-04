import React, { useEffect, useState } from 'react';
import styles from './GraphComponentStyle.module.css';
import ButtonComponent from './Button/ButtonComponent';
import LeftButtonComponent from './Button/LeftButtonComponent';
import LoadingAnimation from '../../loading/LoadingAnimation';
import OpenAI from "openai";

export default function DynamicBarChart() {
    const [etfData, setEtfData] = useState([]); // 전체 ETF 데이터를 저장
    const [offset, setOffset] = useState(0); // 현재 화면의 오프셋
    const [hoveredIndex, setHoveredIndex] = useState(null); // 마우스 오버된 막대의 인덱스
    const [hoveredChange, setHoveredChange] = useState(null); // 마우스 오버된 변동률
    const [maxChange, setMaxChange] = useState(1); // 최대 변동률
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태

    // **ChatGPT API 응답 상태 추가**
    const [chatGPTResponse, setChatGPTResponse] = useState(""); // API 호출 결과 저장

    const FLASK_URL = process.env.REACT_APP_FLASK_URL;
    const barMaxHeight = 200; // 막대의 최대 높이

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
        { symbol: 'EWT', name: '대만' },
    ];

    useEffect(() => {
        const fetchAllEtfData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${FLASK_URL}/api/etf-data?offset=${offset}`);
                const data = await response.json();

                const formattedData = countryMapping.map((country) => {
                    const etf = data[country.symbol];
                    if (!etf || !etf.today_price || !etf.yesterday_price) {
                        return { ...country, percentageChange: 0 };
                    }

                    const todayValue = etf.today_price;
                    const yesterdayValue = etf.yesterday_price;
                    const percentageChange = ((todayValue - yesterdayValue) / yesterdayValue) * 100;

                    return { ...country, percentageChange };
                });

                const maxChange = Math.max(
                    ...formattedData.map((entry) => Math.abs(entry.percentageChange))
                );

                setEtfData(formattedData);
                setMaxChange(maxChange);
            } catch (error) {
                console.error('Error fetching ETF data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllEtfData();
    }, [FLASK_URL, offset]);

    // **ChatGPT API 호출 useEffect**
    useEffect(() => {
        // API 호출 함수
        const fetchChatGPT = async () => {
            try {
                // OpenAI 인스턴스 생성
                const openai = new OpenAI({
                    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // API 키 환경변수 사용
                    dangerouslyAllowBrowser: true, // 브라우저 환경 허용
                });

                // **시스템 메시지와 유저 메시지 구성**
                const messages = [
                    {
                        role: "system",
                        content: "너는 주식관련 상담 챗봇이야. 경제에대한 정보를 줄게 대략적으로 간략하게 설명해줘", // 시스템 메시지
                    },
                    {
                        role: "user",
                        content: "트럼프가 대통령이 됐다", // 셈플 정보
                    },
                ];

                // ChatGPT API 호출
                const response = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages,
                    
                    temperature: 0.7,
                });

                // API 응답 결과 저장
                const result = response.choices[0].message.content;
                setChatGPTResponse(result);
            } catch (error) {
                console.error("Error calling ChatGPT API:", error);
            }
        };

        // 컴포넌트 마운트 시 API 호출
        fetchChatGPT();
    }, []);

    const handleNext = () => {
        if (offset + 10 < etfData.length) {
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
                                {/* 기존 텍스트 대신 ChatGPT API 호출 결과 출력 */}
                                {chatGPTResponse ? chatGPTResponse : (
                                    <>
                                        Text Description...<br />
                                        ......................................................................................<br />
                                        ..................................................................
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={styles['group-3']} style={{ position: 'relative' }}>
                            {isLoading ? (
                                <div style={{
                                    position: 'relative',
                                    top: '39%',
                                    left: '55%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1000
                                }}>
                                    <LoadingAnimation />
                                </div>
                            ) : (
                                <div
                                    className={styles['overlap-group-wrapper']}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        height: `${barMaxHeight}px`,
                                        position: 'relative',
                                    }}
                                >
                                    {/* 그래프 하단 선 */}
                                    <div className={styles['rectangle-2']}></div>
                                    {etfData.slice(offset, offset + 10).map((entry, index) => {
                                        const barHeight =
                                            maxChange > 0
                                                ? (Math.abs(entry.percentageChange) / maxChange) *
                                                  (barMaxHeight / 2.5)
                                                : 0;

                                        const isPositiveChange = entry.percentageChange >= 0;
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
                                                    justifyContent: 'center',
                                                }}
                                                onMouseEnter={() => {
                                                    setHoveredIndex(index);
                                                    setHoveredChange(entry.percentageChange.toFixed(2));
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
                                                        bottom: isPositiveChange
                                                            ? `calc(50% + 14px)`
                                                            : `calc(50% - ${barHeight}px + 14px)`,
                                                        borderRadius: '22.39px',
                                                    }}
                                                ></div>
                                                {hoveredIndex === index && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: isPositiveChange
                                                                ? `calc(50% + ${barHeight}px + 20px)`
                                                                : `calc(50% - ${barHeight}px - 20px)`,
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            fontSize: '10px',
                                                            color: isPositiveChange
                                                                ? 'rgb(171.59, 179.93, 255)'
                                                                : 'rgb(255, 171.59, 211.63)',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {hoveredChange}%{' '}
                                                        {isPositiveChange ? '상승' : '하락'}
                                                    </div>
                                                )}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-14px',
                                                        width: '100%',
                                                        textAlign: 'center',
                                                        fontSize: '10px',
                                                        color: '#38465a',
                                                    }}
                                                >
                                                    {entry.name}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className={styles['left-button']}>
                                <LeftButtonComponent onClick={handlePrev} />
                            </div>
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

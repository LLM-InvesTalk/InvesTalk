import React, { useState } from 'react';
import './TableComponentStyle.css';
import './css/DetailGlobals.css';
import './css/DetailStyleguide.css';

// 어제 데이터를 종목 이름을 기준으로 저장
const yesterdayData = {
    'AAPL': { 등락폭: '2%', 안전성: '5.3점' },
    'SSNLF': { 등락폭: '2%', 안전성: '4.5점' },
    'GOOGL': { 등락폭: '4%', 안전성: '6.0점' },
    'TSLA': { 등락폭: '3%', 안전성: '5.0점' },
    'MSFT': { 등락폭: '5%', 안전성: '4.9점' },
};

// 오늘 데이터
const todayData = [
    { 종목: 'AAPL', 등락폭: '3%', 안전성: '5.5점', 실적발표날짜: '2024년 8월 21일', 희망가격: '300$', ai기준가능성: '80%' },
    { 종목: 'SSNLF', 등락폭: '1%', 안전성: '4.2점', 실적발표날짜: '2023년 7월 15일', 희망가격: '250$', ai기준가능성: '75%' },
    { 종목: 'GOOGL', 등락폭: '5%', 안전성: '6.1점', 실적발표날짜: '2024년 10월 1일', 희망가격: '500$', ai기준가능성: '90%' },
    { 종목: 'TSLA', 등락폭: '2%', 안전성: '4.8점', 실적발표날짜: '2023년 12월 12일', 희망가격: '400$', ai기준가능성: '85%' },
    { 종목: 'MSFT', 등락폭: '4%', 안전성: '5.0점', 실적발표날짜: '2024년 6월 20일', 희망가격: '350$', ai기준가능성: '78%' },
];

const TableComponent = () => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // 정렬 로직
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

    // 상승/하락에 따른 클래스 설정
    const getClassForChange = (todayValue, yesterdayValue) => {
        const todayNum = parseFloat(todayValue.replace('%', '').replace('점', ''));
        const yesterdayNum = parseFloat(yesterdayValue.replace('%', '').replace('점', ''));
        
        if (todayNum > yesterdayNum) {
            return 'text-wrapper-4'; // 상승
        } else {
            return 'text-wrapper-6'; // 하락
        }
    };

    // 비교하는 로직을 종목 이름을 기준으로 수정
    const sortedData = [...todayData].sort((a, b) => {
        if (sortConfig.key) {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];

            // 숫자형 값에 대한 처리
            if (sortConfig.key !== '종목' && sortConfig.key !== '실적발표날짜') {
                const numA = parseFloat(valueA.replace('%', '').replace('$', ''));
                const numB = parseFloat(valueB.replace('%', '').replace('$', ''));
                return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
            }

            // 문자열(종목, 실적발표날짜)의 경우
            return sortConfig.direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        }
        return 0;
    });

    return (
        <div className="frame-wrapper">
            <div className="frame">
                {/* 종목 */}
                <div className="frame-2">
                    <p className="p">
                        <span className="text-wrapper">종목</span>
                        <span
                            className="span arrow"
                            onClick={() => handleSort('종목')}
                        >
                            {getArrow('종목')}
                        </span>
                    </p>
                    <div className="frame-3">
                        {sortedData.map((item, index) => (
                            <div key={index} className="text-wrapper-2">{item.종목}</div>
                        ))}
                    </div>
                </div>

                {/* 그래프 */}
                <div className="frame-4">
                    <p className="div-2">
                        <span className="text-wrapper">그래프</span>
                    </p>
                    <div className="frame-5">
                        {sortedData.map((_, index) => (
                            <div key={index} className="rectangle-2"></div>
                        ))}
                    </div>
                </div>

                {/* 등락폭 */}
                <div className="frame-6">
                    <p className="div-3">
                        <span className="text-wrapper">등락폭</span>
                        <span
                            className="span arrow"
                            onClick={() => handleSort('등락폭')}
                        >
                            {getArrow('등락폭')}
                        </span>
                    </p>
                    <div className="frame-7">
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

                {/* 안전성 */}
                <div className="frame-8">
                    <p className="div-4">
                        <span className="text-wrapper">안전성</span>
                        <span
                            className="span arrow"
                            onClick={() => handleSort('안전성')}
                        >
                            {getArrow('안전성')}
                        </span>
                    </p>
                    <div className="frame-3">
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

                {/* 실적발표날짜 */}
                <div className="frame-9">
                    <p className="div-5">
                        <span className="text-wrapper">실적발표날짜</span>
                        <span
                            className="span arrow"
                            onClick={() => handleSort('실적발표날짜')}
                        >
                            {getArrow('실적발표날짜')}
                        </span>
                    </p>
                    <div className="frame-3">
                        {sortedData.map((item, index) => (
                            <div key={index} className="text-wrapper-2">{item.실적발표날짜}</div>
                        ))}
                    </div>
                </div>

                {/* 나의 희망가격 */}
                <div className="frame-10">
                    <p className="div-6">
                        <span className="text-wrapper">나의 희망가격</span>
                        <span
                            className="span arrow"
                            onClick={() => handleSort('희망가격')}
                        >
                            {getArrow('희망가격')}
                        </span>
                    </p>
                    <div className="frame-11">
                        {sortedData.map((item, index) => (
                            <div key={index} className="text-wrapper-2">{item.희망가격}</div>
                        ))}
                    </div>
                </div>

                {/* ai 기준 가능성 */}
                <div className="frame-10">
                    <p className="ai">
                        <span className="text-wrapper">ai기준가능성</span>
                        <span
                            className="span arrow"
                            onClick={() => handleSort('ai기준가능성')}
                        >
                            {getArrow('ai기준가능성')}
                        </span>
                    </p>
                    <div className="frame-12">
                        {sortedData.map((item, index) => (
                            <div key={index} className="text-wrapper-7">{item.ai기준가능성}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableComponent;

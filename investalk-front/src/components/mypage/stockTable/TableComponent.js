import React, { useState, useEffect } from "react";
import styles from "./TableComponentStyle.module.css"; // CSS 모듈로 가져옴
import axios from "axios";
import MyGraph from "./graph/mygraph"; // MyGraph 경로에 따라 수정
import LoadingAnimation from "../../loading/LoadingAnimation";

axios.defaults.withCredentials = true;
const FLASK_URL = process.env.REACT_APP_FLASK_URL;

const TableComponent = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [stockData, setStockData] = useState([]); // 백엔드 데이터를 저장할 state
  const [loading, setLoading] = useState(false); // 로딩 상태

  // "나의 희망가격" 편집 상태를 위한 state
  /* editingIndex: 현재 편집 중인 row의 index
     tempHopePrice: 임시로 입력받을 "나의 희망가격" 값 */
  const [editingIndex, setEditingIndex] = useState(null); // 주석: 현재 편집 중인 종목의 index
  const [tempHopePrice, setTempHopePrice] = useState(""); // 주석: 임시로 입력받을 희망가격

  // 백엔드에서 데이터 가져오기
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${FLASK_URL}/api/user/favorite_stocks`);
      console.log("API 응답 데이터:", response.data);
      setStockData(response.data);
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 정렬 핸들러
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // 정렬 화살표 표시
  const getArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "△" : "▽";
    }
    return "▽";
  };

  // 등락폭 컬러 클래스 결정
  const getClassForChange = (direction) => {
    if (direction === "up") {
      return styles["text-wrapper-4"]; // 상승
    } else {
      return styles["text-wrapper-6"]; // 하락
    }
  };

  // 정렬 로직
  const sortedData = [...stockData].sort((a, b) => {
    if (sortConfig.key) {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      // 문자열인 경우, 문자열 비교 (예: 종목)
      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortConfig.direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // 숫자형 데이터 처리 (안전성, 나의 희망가격 등)
      const parseValue = (value) => {
        if (typeof value === "string") {
          // 날짜인 경우
          if (/\d{4}년 \d{2}월 \d{2}일/.test(value)) {
            // 실적발표날짜를 Date 객체로 변환
            return new Date(
              value.replace("년 ", "-").replace("월 ", "-").replace("일", "")
            ).getTime();
          }
          // %나 $, 점 제거 후 숫자로 변환
          return parseFloat(value.replace("%", "").replace("$", "").replace("점", ""));
        } else if (typeof value === "object" && value?.change) {
          // 객체(등락폭)라면 change 값을 사용
          return value.change;
        }
        return value || 0; // 그 외(숫자형이거나 없으면 0)
      };

      const numA = parseValue(valueA);
      const numB = parseValue(valueB);
      return sortConfig.direction === "asc" ? numA - numB : numB - numA;
    }
    return 0;
  });

  // "나의 희망가격" 편집 모드 진입 핸들러
  /* 주석: 클릭 시 editingIndex를 현재 index로 세팅하고
           tempHopePrice에는 기존 "나의희망가격"을 넣어줌 */
  const handleHopePriceClick = (index, currentHopePrice) => {
    setEditingIndex(index);
    setTempHopePrice(currentHopePrice || "");
  };

  //  "나의 희망가격" 입력 후 엔터 처리 핸들러
  /* 주석: 엔터키를 누르면 stockData를 업데이트하고 편집모드를 종료함 */
  const handleHopePriceKeyDown = async (e, index) => {
    if (e.key === "Enter") {
      const symbol = stockData[index].symbol;
      try {
        await axios.post(`${FLASK_URL}/api/user/update_price`, {
          symbol: symbol,
          desired_price: tempHopePrice
        });
        // 수정 후, 다시 전체 GET → ai기준가능성 즉시 업데이트
        await fetchData();
      } catch (error) {
        console.error("희망가격 업데이트 중 오류:", error);
      } finally {
        setEditingIndex(null);
        setTempHopePrice("");
      }
    }
  };
  // 1~5 평점을 대응하는 문구로 변환
  const getAnalystRatingText = (rating) => {
    switch (rating) {
      case 5:
        return "스트롱 바이";
      case 4:
        return "바이";
      case 3:
        return "뉴트럴";
      case 2:
        return "셀";
      case 1:
        return "스트롱 셀";
      default:
        return "N/A";
    }
  };

  // 1~5 평점을 색상으로 매핑 (원하는 색상으로 조정 가능)
  const getAnalystRatingClass = (rating) => {
    switch (rating) {
      case 5:
        return styles["rating-5"];
      case 4:
        return styles["rating-4"];
      case 3:
        return styles["rating-3"];
      case 2:
        return styles["rating-2"];
      case 1:
        return styles["rating-1"];
      default:
        return styles["rating-default"];
    }
  };



  return (
    <div className={styles["div-wrapper"]}>
      <div className={styles["frame-wrapper"]}>
        <div className={styles["frame"]}>

          {/* --------------------------------------------------- 
               1) 종목 
          --------------------------------------------------- */}
          <div className={styles["frame-2"]}>
            <p className={styles["p"]}>
              <span className={styles["text-wrapper"]}>종목</span>
              <span
                className={`${styles["span"]} ${styles["arrow"]}`}
                onClick={() => handleSort("symbol")}
              >
                {getArrow("symbol")}
              </span>
            </p>
            <div className={styles["frame-3"]}>
              {sortedData.map((item, index) => (
                <div key={index} className={styles["text-wrapper-2"]}>
                  {item.symbol}
                </div>
              ))}
            </div>
          </div>

          {/* --------------------------------------------------- 
               2) 그래프 
          --------------------------------------------------- */}
          <div className={styles["frame-4"]}>
            <p className={styles["div-2"]}>
              <span className={styles["text-wrapper"]}>그래프</span>
            </p>
            <div className={styles["frame-5"]}>
              {loading ? (
                <div style={{
                  position: 'absolute',
                  top: '130px',
                  left: '250px',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1000
                }}>
                  <LoadingAnimation />
                </div>
              ) : (
                sortedData.map((item, index) => (
                  <div key={index} className={styles["graph-wrapper"]}>
                    <MyGraph data={item.그래프} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --------------------------------------------------- 
               3) 등락폭 
          --------------------------------------------------- */}
          <div className={styles["frame-6"]}>
            <p className={styles["div-3"]}>
              <span className={styles["text-wrapper"]}>등락폭</span>
              <span
                className={`${styles["span"]} ${styles["arrow"]}`}
                onClick={() => handleSort("등락폭")}
              >
                {getArrow("등락폭")}
              </span>
            </p>
            <div className={styles["frame-7"]}>
              {sortedData.map((item, index) => {
                const changeData = item.등락폭;
                const changeText =
                  typeof changeData === "object"
                    ? `${changeData.change}%`
                    : changeData || "N/A";
                return (
                  <div
                    key={index}
                    className={getClassForChange(changeData?.direction)}
                  >
                    {changeText}
                  </div>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------- 
                4) 안전성 
          --------------------------------------------------- */}
          <div className={styles["frame-8"]}>
            <p className={styles["div-4"]}>
              <span className={styles["text-wrapper"]}>안전성</span>
              <span
                className={`${styles["span"]} ${styles["arrow"]}`}
                onClick={() => handleSort("안정성")}
              >
                {getArrow("안정성")}
              </span>
            </p>
            <div className={styles["frame-3"]}>
              {sortedData.map((item, index) => {
                const rating = item.안정성;             // 숫자 (1~5 등)
                const ratingText = getAnalystRatingText(rating);
                const ratingClass = getAnalystRatingClass(rating); // 위에서 만든 함수

                return (
                  <div key={index} className={ratingClass}>
                    {ratingText}
                  </div>
                );
              })}
            </div>
          </div>



          {/* --------------------------------------------------- 
               5) 실적발표날짜 
          --------------------------------------------------- */}
          <div className={styles["frame-9"]}>
            <p className={styles["div-5"]}>
              <span className={styles["text-wrapper"]}>실적발표날짜</span>
              <span
                className={`${styles["span"]} ${styles["arrow"]}`}
                onClick={() => handleSort("실적발표날짜")}
              >
                {getArrow("실적발표날짜")}
              </span>
            </p>
            <div className={styles["frame-3"]}>
              {sortedData.map((item, index) => (
                <div key={index} className={styles["text-wrapper-2"]}>
                  {item.실적발표날짜}
                </div>
              ))}
            </div>
          </div>

          {/* --------------------------------------------------- 
               6) 나의 희망가격 (클릭 시 인풋으로 전환)
          --------------------------------------------------- */}
          <div className={styles["frame-10"]}>
            <p className={styles["div-6"]}>
              <span className={styles["text-wrapper"]}>나의 희망가격</span>
              <span
                className={`${styles["span"]} ${styles["arrow"]}`}
                onClick={() => handleSort("나의희망가격")}
              >
                {getArrow("나의희망가격")}
              </span>
            </p>
            <div className={styles["frame-11"]}>
              {sortedData.map((item, index) => (
                <div key={index}>
                  {/* 주석: 편집 중인 행이면 input, 아니면 일반 div 표시 */}
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={tempHopePrice}
                      onChange={(e) => setTempHopePrice(e.target.value)}
                      onKeyDown={(e) => handleHopePriceKeyDown(e, index)}
                      style={{ width: "60px" }}
                    />
                  ) : (
                    <div
                      className={styles["text-wrapper-2"]}
                      onClick={() =>
                        handleHopePriceClick(index, item.나의희망가격)
                      }
                    >
                      {item.나의희망가격}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* --------------------------------------------------- 
               7) ai기준가능성 
          --------------------------------------------------- */}
          <div className={styles["frame-10"]}>
            <p className={styles["ai"]}>
              <span className={styles["text-wrapper"]}>ai기준가능성</span>
              <span
                className={`${styles["span"]} ${styles["arrow"]}`}
                onClick={() => handleSort("ai기준가능성")}
              >
                {getArrow("ai기준가능성")}
              </span>
            </p>
            <div className={styles["frame-12"]}>
              {sortedData.map((item, index) => (
                <div key={index} className={styles["text-wrapper-7"]}>
                  {item.ai기준가능성}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TableComponent;

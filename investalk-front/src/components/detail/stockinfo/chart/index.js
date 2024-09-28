import { AreaPlot, lineElementClasses } from "@mui/x-charts/LineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks";
import { LinePlot } from "@mui/x-charts/LineChart";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { colors } from "@mui/joy";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

const StockInfoChart = (props) => {
  // const tickerSymbol = "TSLA";
  // const period = "1d";
  const { tickerSymbol, period } = props;
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/stockinfochart/${tickerSymbol}/${period}`)
      .then((response) => {
        console.log(response.data); // 데이터 확인을 위해 로그 출력
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [tickerSymbol, period]);

  const config = {
    dataset: data || [], // 데이터가 없을 때 빈 배열로 처리
    xAxis: [
      {
        dataKey: "x",
      },
    ],
    series: [
      {
        type: "line",
        curve: "natural",
        dataKey: "y",
        showMark: false,
        area: true,
        color: "#D2A5FF",
      },
    ],
    width: 300,
    height: 100,
    margin: { top: 25, bottom: 50, left: 50, right: 30 },
  };

  function ColorSwich({ threshold, color1, color2, id }) {
    const { top, height, bottom } = useDrawingArea();
    const svgHeight = top + bottom + height;

    const scale = useYScale();
    const y0 = scale(threshold);
    const off = y0 !== undefined ? y0 / svgHeight : 0;

    return (
      <defs>
        <linearGradient
          id={id}
          x1="0"
          x2="0"
          y1="0"
          y2={`${svgHeight}px`}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={off} stopColor={color1} stopOpacity={1} />
          <stop offset={off} stopColor={color2} stopOpacity={1} />
        </linearGradient>
      </defs>
    );
  }

  return (
    <div>
      {data ? (
        <ResponsiveChartContainer {...config}>
          <LinePlot />
        </ResponsiveChartContainer>
      ) : (
        <p>Loading data...</p> // 데이터 로딩 중 메시지
      )}
    </div>
  );
};

export default StockInfoChart;

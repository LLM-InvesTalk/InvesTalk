import { AreaPlot, lineElementClasses } from "@mui/x-charts/LineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks";
import { LinePlot } from "@mui/x-charts/LineChart";

import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { colors } from "@mui/joy";

import { format } from "date-fns";

const AnalyzeChart = () => {
  // const dataset = [
  //   { x: 0, y: 2000 },
  //   { x: 1, y: 4000 },
  //   { x: 2, y: 3000 },
  //   { x: 3, y: 2000 },
  //   { x: 4, y: 2780 },
  //   { x: 5, y: -1890 },
  //   { x: 6, y: 3490 },
  //   { x: 8, y: -2000 },
  //   { x: 9, y: 2780 },
  //   { x: 10, y: 1890 },
  //   { x: 11, y: 3490 },
  //   { x: 12, y: 3490 },
  // ];

  // 3개월간의 일별 데이터 생성
  const dataset = Array.from({ length: 90 }, (_, i) => ({
    x: new Date(2024, 0, 1 + i), // 2024년 1월 1일부터 시작해서 90일간
    y: Math.floor(Math.random() * 6000) - 2000, // -2000에서 4000 사이의 랜덤 값
  }));

  const config = {
    dataset: dataset,
    xAxis: [
      {
        dataKey: "x",
        type: "time",
        tickFormatter: (date) => format(date, "MMM d"), // 'MMM d' 형식으로 날짜 표시 (예: Jan 1)
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
    width: 600,
    height: 100,
    margin: { top: 25, bottom: 5, left: 0, right: 30 },
    sx: {
      [`& .${areaElementClasses.root}`]: {
        fill: "url(#rainbow-gradient)",
      },
      [`& .${lineElementClasses.root}`]: {
        strokeWidth: 1,
      },
    },
  };

  function RainbowGradient({ id }) {
    return (
      <defs>
        <linearGradient id={id} x2="0" y2="1" gradientUnits="objectBoundingBox">
          {/* <stop offset="0%" stopColor="#FF0000" />
          <stop offset="16.7%" stopColor="#FF7F00" />
          <stop offset="33.3%" stopColor="#FFFF00" /> */}
          <stop offset="0%" stopColor="rgb(225, 247, 255)" />
          <stop offset="30%" stopColor="rgb(236, 255, 248)" />
          <stop offset="100%" stopColor="rgb(247, 239, 255)" />
        </linearGradient>
      </defs>
    );
  }

  return (
    <ResponsiveChartContainer {...config}>
      <LinePlot />
      <AreaPlot />
      <RainbowGradient id="rainbow-gradient" />
    </ResponsiveChartContainer>
  );
};

export default AnalyzeChart;

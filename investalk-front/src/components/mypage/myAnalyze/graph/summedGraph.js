import React from "react";
import { AreaPlot, lineElementClasses } from "@mui/x-charts/LineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { LinePlot } from "@mui/x-charts/LineChart";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";

const SummedGraph = ({ data = [] }) => {
  // [1] 데이터의 최소값과 최대값 구하기
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);

  // [2] 최소-최대값 사이에 여백(padding)을 주어 y축 범위를 조금 더 넓게 잡기
  const padding = (dataMax - dataMin) * 0.01; // 1% 정도 여유를 줌

  // [3] @mui/x-charts 설정
  const config = {
    dataset: data.map((value, index) => ({ x: index, y: value })), // 데이터를 x, y 형태로 변환
    xAxis: [{ dataKey: "x" }],
    // **여기서 yAxis 도메인을 직접 설정해 줍니다.**
    yAxis: [
      {
        dataKey: "y",
        min: dataMin - padding,
        max: dataMax + padding,
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
    width: 700,
    height: 130,
    margin: { top: 25, bottom: 5, left: 0, right: 30 },
    sx: {
      [`& .${areaElementClasses.root}`]: {
        fill: "url(#swich-color-id-1)",
      },
      [`& .${lineElementClasses.root}`]: {
        strokeWidth: 1,
      },
    },
  };

  function ColorSwich({ threshold, color1, color2, id }) {
    return (
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="100%">
          <stop offset="50%" stopColor={color1} stopOpacity={1} />
          <stop offset="50%" stopColor={color2} stopOpacity={1} />
        </linearGradient>
      </defs>
    );
  }

  return (
    <ResponsiveChartContainer {...config}>
      <LinePlot />
      <AreaPlot />
      <ChartsReferenceLine y={0} />
      <ColorSwich
        color1="rgb(225, 247, 255)"
        color2="rgb(247, 239, 255)"
        threshold={0}
        id="swich-color-id-1"
      />
    </ResponsiveChartContainer>
  );
};

export default SummedGraph;

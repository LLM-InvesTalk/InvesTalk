import React from "react";
import { AreaPlot, lineElementClasses } from "@mui/x-charts/LineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { LinePlot } from "@mui/x-charts/LineChart";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks"; // Y축 스케일과 영역 가져오기

const SummedGraph = ({ data = [] }) => {
  // [1] 데이터의 최소값과 최대값 구하기
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);

  // [2] 데이터의 평균값 계산
  const yMean = data.reduce((a, b) => a + b, 0) / data.length;

  // [3] 최소-최대값 사이에 여백(padding)을 주어 y축 범위를 조금 더 넓게 잡기
  const padding = (dataMax - dataMin) * 0.01; // 1% 정도 여유를 줌

  // [4] @mui/x-charts 설정
  const config = {
    dataset: data.map((value, index) => ({ x: index, y: value })), // 데이터를 x, y 형태로 변환
    xAxis: [{ dataKey: "x" }],
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
        fill: "url(#switch-color-summedgraph)",
      },
      [`& .${lineElementClasses.root}`]: {
        strokeWidth: 1,
      },
    },
  };

  function ColorSwitch({ threshold, color1, color2, id }) {
    const { top, height, bottom } = useDrawingArea(); // 그래프 영역 가져오기
    const svgHeight = top + bottom + height;

    const scale = useYScale(); // Y축 값 -> 픽셀 변환
    const y0 = scale(threshold);
    const off = y0 !== undefined ? y0 / svgHeight : 0; // `threshold` 기준으로 비율 계산

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
    <ResponsiveChartContainer {...config}>
      <LinePlot />
      <AreaPlot />
      <ColorSwitch
        color1="rgb(225, 247, 255)"
        color2="rgb(247, 239, 255)"
        threshold={yMean} // 평균값을 기준으로 색 전환
        id="switch-color-summedgraph"
      />
    </ResponsiveChartContainer>
  );
};

export default SummedGraph;

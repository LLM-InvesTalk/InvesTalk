import React from "react";
import {
  AreaPlot,
  LinePlot,
  lineElementClasses,
  areaElementClasses,
} from "@mui/x-charts/LineChart";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks";

const MyGraph = ({ data }) => {
  // x값 생성
  const dataset = data.map((y, index) => ({ x: index, y }));

  // 데이터의 평균값 계산
  const yMean = data.reduce((a, b) => a + b, 0) / data.length;

  // y축 범위를 평균값을 중심으로 좁게 설정 (예: ±0.5)
  const yRange = 2;
  const adjustedYMin = yMean - yRange;
  const adjustedYMax = yMean + yRange;

  const config = {
    dataset: dataset,
    xAxis: [{ dataKey: "x", hide: true }], // x축 숨김 처리
    yAxis: [{ min: adjustedYMin, max: adjustedYMax, hide: true }], // y축 숨김 처리
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
    width: 50,
    height: 50,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
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
    <ResponsiveChartContainer {...config}>
      <LinePlot />
      <AreaPlot />
      {/* 필요에 따라 레퍼런스 라인 제거 */}
      {/* <ChartsReferenceLine y={0} /> */}
      <ColorSwich
        color1="rgb(225, 247, 255)"
        color2="rgb(247, 239, 255)"
        threshold={yMean}
        id="swich-color-id-1"
      />
    </ResponsiveChartContainer>
  );
};

export default MyGraph;

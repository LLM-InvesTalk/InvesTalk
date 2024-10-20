import { AreaPlot, lineElementClasses } from "@mui/x-charts/LineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { useYScale, useDrawingArea } from "@mui/x-charts/hooks";
import { LinePlot } from "@mui/x-charts/LineChart";

import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
import { colors } from "@mui/joy";

const MyGraph = () => {
  const dataset = [
    { x: 0, y: 2000 },
    { x: 10, y: 4000 },
    { x: 20, y: 3000 },
    { x: 30, y: 2000 },
    { x: 40, y: 2780 },
    { x: 50, y: -1890 },
    { x: 60, y: 3490 },
    { x: 80, y: -2000 },
    { x: 90, y: 2780 },
    { x: 100, y: 1890 },
    { x: 110, y: 3490 },
    { x: 120, y: 3490 },
    { x: 130, y: 2780 },
    { x: 140, y: 1890 },
    { x: 150, y: 3490 },
    { x: 160, y: 3490 },
    { x: 170, y: 2780 },
    { x: 180, y: 1890 },
    { x: 190, y: 3490 },
    { x: 200, y: 3490 },
  ];

  const config = {
    dataset: dataset,
    xAxis: [{ dataKey: "x" }],
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
    width: 50, // 너비 조정
    height: 55, // 높이 조정
    margin: { top: 0, bottom: 30, left: 0, right: 0 }, // 그래프 여백 조정
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

export default MyGraph;

import dynamic from "next/dynamic";

export interface INodeChartProps {
  data: { ip: string; score: number }[];
  colors: string[];
  onClick: (ip: string) => void;
}

const NodeChart: React.FC<INodeChartProps> = ({ data, colors, onClick }) => (
  <Pie
    appendPadding={0}
    data={data}
    angleField="score"
    colorField="ip"
    color={colors}
    radius={0.9}
    label={{
      type: "inner",
      offset: "-30%",
      content: (_ref: any) => Math.floor(_ref.percent * 100) + "%",
      style: {
        textAlign: "center",
      },
    }}
    height={300}
    interactions={[{ type: "element-active" }]}
    legend={{
      layout: "vertical",
      position: "bottom",
      flipPage: false,
    }}
    animation={false}
    pieStyle={{ cursor: "pointer" }}
    onEvent={(_, e) => {
      if (e.type === "element:click" && e.data?.data?.ip) {
        onClick(e.data?.data.ip);
      }
    }}
  />
);

export default NodeChart;

const Pie = dynamic(async () => (await import("@ant-design/charts")).Pie, {
  ssr: false,
});

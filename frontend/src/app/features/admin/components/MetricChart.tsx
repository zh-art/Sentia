import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricChartProps {
  title: string;
  data: { time: string; [key: string]: any }[];
  dataKey: string;
}

export default function MetricChart({ title, data, dataKey }: MetricChartProps) {
  return (
    <div>
      <h2 className="mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

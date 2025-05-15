"use client";
import React, { useState } from "react";
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
  const latestValue = data.length ? data[data.length - 1][dataKey] : 0;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleView = () => setIsExpanded(!isExpanded);

  const isGauge = title.toLowerCase().includes("uso");
  const isRequestCircle = title.toLowerCase().includes("cantidad");

  const containerClasses = `
    h-[300px] border rounded-xl p-4 shadow-sm transition-all duration-300
    ${isExpanded
      ? "bg-white dark:bg-black cursor-default"
      : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"}
  `;

  const renderGauge = () => {
    const percent = Math.min(Math.max(latestValue, 0), 100);
    const color =
      percent < 50
        ? "text-green-800 stroke-green-400"
        : percent < 75
        ? "text-yellow-800 stroke-yellow-400"
        : "text-red-800 stroke-red-400";

    return (
      <div className="flex flex-col items-center justify-center h-48 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#a0aec0" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(percent / 100) * 314}, 314`}
            strokeWidth="10"
            transform="rotate(-90 60 60)"
            className={color}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fontSize="20"
            className={color + " font-semibold"}
          >
            {percent}%
          </text>
        </svg>
      </div>
    );
  };

  const renderRequestCircle = () => {
    const average =
      data.reduce((acc, cur) => acc + (cur[dataKey] || 0), 0) / (data.length || 1);

    return (
      <div className="flex items-center justify-center h-48 pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold">{average.toFixed(1)}</span>
          <span className="text-sm">msg/min</span>
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses} onClick={toggleView}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      {isExpanded ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : isGauge ? (
        renderGauge()
      ) : isRequestCircle ? (
        renderRequestCircle()
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

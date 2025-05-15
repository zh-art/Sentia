"use client";
import React, { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

interface FeedbackPieChartProps {
    positive: number;
    negative: number;

}

const COLORS = ["#10B981", "#EF4444"]; // Verde, Rojo

export default function FeedbackPieChart({ positive, negative }: FeedbackPieChartProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleView = () => setIsExpanded(!isExpanded);

    const pieData = [
        { name: "Respuestas Positivas", value: positive },
        { name: "Respuestas Deficientes", value: negative },
    ];

    // Simulamos valores históricos para gráfico de línea
    const lineData = Array.from({ length: 12 }, (_, i) => ({
        time: `T-${12 - i}`,
        positivas: Math.floor(Math.random() * positive),
        deficientes: Math.floor(Math.random() * negative),
    }));

    return (
        <div className={`h-[300px] border rounded-xl p-4 shadow-sm transition-all duration-300 ${isExpanded ? "bg-white dark:bg-black cursor-default" : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer"}`} onClick={toggleView}>
            <h2 className="mb-2 font-semibold">Valoración de Respuestas</h2>
            <ResponsiveContainer width="100%" height={250}>
                {isExpanded ? (
                    <LineChart data={lineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="positivas" stroke="#10B981" />
                        <Line type="monotone" dataKey="deficientes" stroke="#EF4444" />
                    </LineChart>
                ) : (
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            dataKey="value"
                        >
                            {pieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}

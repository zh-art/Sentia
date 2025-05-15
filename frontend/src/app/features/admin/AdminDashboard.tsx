"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import MetricChart from "./components/MetricChart";
import HealthTable from "./components/HealthTable";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import FeedbackPieChart from "./components/FeedbackPieChart";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminDashboard() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/metrics/`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const { data: healthData } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/health-systems`,
    (url) => fetch(url, { method: "POST" }).then((r) => r.json()),
    { refreshInterval: 10000 }
  );

  const [cpuHist, setCpuHist] = useState<{ time: string; value: number }[]>([]);
  const [gpuHist, setGpuHist] = useState<{ time: string; value: number }[]>([]);
  const [reqHist, setReqHist] = useState<{ time: string; count: number }[]>([]);
  const [dbUsageHist, setDbUsageHist] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    if (!data) return;
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setCpuHist((p) => [...p, { time, value: data.cpuUsage }].slice(-60));
    setGpuHist((p) => [...p, { time, value: data.gpuUsage }].slice(-60));
    setReqHist((p) => [...p, { time, count: data.requestFrequency }].slice(-60));
    setDbUsageHist((p) => [...p, { time, value: data.dbStorageUsage || 0 }].slice(-60));
  }, [data]);

  if (error) return <p>Error cargando métricas.</p>;
  if (!data) return <p>Cargando métricas…</p>;

  return (
    <main className="p-8">
      <ThemeToggle />
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid gap-8 md:grid-cols-2 mb-8 ">
        <MetricChart title="Cantidad de Usuarios Activos" data={reqHist} dataKey="count" />
        <MetricChart title="Cantidad de peticiones / min" data={reqHist} dataKey="count" />
        <FeedbackPieChart positive={32} negative={5} />
        <MetricChart title="Uso de almacenamiento de BD (%)" data={dbUsageHist} dataKey="value" />
        <MetricChart title="Uso de CPU (%)" data={cpuHist} dataKey="value" />
        <MetricChart title="Uso de GPU (%)" data={gpuHist} dataKey="value" />
      </div>
      <HealthTable health={healthData} />
    </main>
  );
}
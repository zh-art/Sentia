"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import MetricChart from "./components/MetricChart";
import HealthTable from "./components/HealthTable";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import FeedbackPieChart from "./components/FeedbackPieChart";
import Navbar from "../navbar/Navbar";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminDashboard() {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/metrics/`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const [healthData, setHealthData] = useState<Record<string, string>>({
    "IA Auth Key": "...",
    "IA API Respuesta": "...",
    "Temporizador": "...",
    "Scheduler": "...",
    "Base de datos": "..."
  });

  useEffect(() => {
    const fetchHealth = async () => {
      const endpoints = [
        { key: "IA Auth Key", url: "ia-auth" },
        { key: "IA API Respuesta", url: "ia-api" },
        { key: "Temporizador", url: "timer" },
        { key: "Scheduler", url: "scheduler" },
        { key: "Base de datos", url: "db" }
      ];

      const newHealth: Record<string, string> = { ...healthData };

      await Promise.all(
        endpoints.map(async ({ key, url }) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health/${url}`);
            const data = await res.json();
            newHealth[key] = data.status === "ok" ? "ok" : `warning: ${data.message}`;
          } catch (err: any) {
            newHealth[key] = `error: ${err.message || "Fallo de conexión"}`;
          }
        })
      );

      setHealthData(newHealth);
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const [activeUsersData, setActiveUsersData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/active`);
        const json = await res.json();
        const now = new Date().toLocaleTimeString();
        setActiveUsersData(prev => [...prev.slice(-19), { time: now, value: json.active_users }]);
      } catch (err) {
        console.error("Error al obtener usuarios activos", err);
      }
    };

    const interval = setInterval(fetchActiveUsers, 5000);
    return () => clearInterval(interval);
  }, []);

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
    setDbUsageHist((p) => [...p, { time, value: data.dbStorageUsagePercent || 0, rawValue: data.dbStorageUsage || 0 }].slice(-60));
  }, [data]);

  if (error) return <p>Error cargando métricas.</p>;
  if (!data) return <p>Cargando métricas…</p>;

  return (
    <>
      <Navbar title="Panel de administración" items={[
        { name: "Inicio", url: "/" },
        { name: "Sobre Nosotros", url: "/sobre-nosotros" },
        { name: "Actualizaciones", url: "/actualizaciones" },
        { name: "Volver al chat", url: "/chat"}
      ]} />
      <main className="p-8">
        <div className="grid gap-8 md:grid-cols-2 mb-8">
          <MetricChart title="Cantidad de Usuarios Activos" data={activeUsersData} dataKey="value" />
          <MetricChart title="Cantidad de peticiones / min" data={reqHist} dataKey="count" />
          <FeedbackPieChart positive={32} negative={5} />
          <MetricChart title="Uso de almacenamiento de BD (%)" data={dbUsageHist} dataKey="value" />
          <MetricChart title="Uso de CPU (%)" data={cpuHist} dataKey="value" />
          <MetricChart title="Uso de GPU (%)" data={gpuHist} dataKey="value" />
        </div>
        <HealthTable health={healthData} />
      </main>
    </>
  );
}
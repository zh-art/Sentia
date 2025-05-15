import React from "react";

interface HealthTableProps {
  health: Record<string, string>;
}

export default function HealthTable({ health }: HealthTableProps) {
  const getStatusColor = (value: string) => {
  if (value.toLowerCase().includes("ok")) return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
  if (value.toLowerCase().includes("not running")) return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
  return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
};

  const extractErrorMessage = (value: string) => {
    if (value.toLowerCase().includes("error") || value.toLowerCase().includes("fail")) {
      const parts = value.split(":");
      return parts.length > 1 ? parts.slice(1).join(":").trim() : null;
    }
    return null;
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">Health Checks</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(health).map(([key, val]) => {
          const colorClass = getStatusColor(val);
          const errorMsg = extractErrorMessage(val);

          return (
            <div key={key} className={`p-4 border rounded-xl shadow-sm ${colorClass} dark:bg-opacity-60`} >
              <div className="font-semibold uppercase text-sm mb-1">{key}</div>
              <div className="text-base font-bold">{val.split(":")[0]}</div>
              {errorMsg && (
                <div className="text-xs mt-1 text-gray-600 italic">
                  {errorMsg}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

import React from "react";

interface HealthTableProps {
  health: Record<string, string>;
}

export default function HealthTable({ health }: HealthTableProps) {
  return (
    <section>
      <h2 className="text-xl font-bold mt-8 mb-2">Health Checks</h2>
      <table className="w-full text-left border-separate border-spacing-y-1">
        <thead className="sr-only">
          <tr>
            <th>Servicio</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(health).map(([key, val]) => {
            const value = String(val);
            const isUp = value === "up";
            const isError = value.startsWith("error");
            const isDown = !isUp && !isError;

            const color = isUp
              ? "text-green-600"
              : isError
              ? "text-red-600"
              : "text-yellow-600";

            return (
              <tr key={key} className="align-top">
                <td className="font-semibold uppercase pr-4">{key}:</td>
                <td className={color} title={isUp ? "" : value}>
                  {isUp ? "Up" : "Down"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

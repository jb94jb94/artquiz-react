import { useUserStats } from "../hooks/useUserData";
import "./StatsTable.css";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import * as React from "react";


function formatTooltip(detail: Record<string, number> | null) {
  if (!detail) return "Keine Daten";
  return Object.entries(detail)
    .map(([name, count]) => `${count}× ${name}`)
    .join(", ");
}

function formatPercent(value: number | null) {
  if (value === null || value === undefined) return "-";
  return value.toFixed(1) + "%";
}

export function StatsTable() {
  const { stats, loading } = useUserStats();

  if (loading) return <p>Statistiken werden geladen …</p>;

  return (
    <>
      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Künstler</th>
            <th className="p-2">Richtig</th>
            <th className="p-2">Nicht erkannt</th>
            <th className="p-2">Fälschlich geraten</th>
            <th className="p-2">Trefferquote</th>
            <th className="p-2">Präzision</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, index) => (
            <tr key={row.artist} className="border-t">
              <td className="p-2">{row.artist}</td>
              <td className="p-2">{row.correct}</td>
              <td
                className="p-2"
                data-tooltip-id={`notRecogTooltip-${index}`}
                data-tooltip-content={formatTooltip(row.not_recognized_detail)}
              >
                {row.not_recognized}
              </td>
              <td
                className="p-2"
                data-tooltip-id={`falselyGuessTooltip-${index}`}
                data-tooltip-content={formatTooltip(row.falsely_guessed_detail)}
              >
                {row.falsely_guessed}
              </td>
              <td className="p-2">{formatPercent(row.hit_rate)}</td>
              <td className="p-2">{formatPercent(row.precision_value)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tooltip-Instanzen für jede ID */}
      {stats.map((_, index) => (
        <React.Fragment key={index}>
          <Tooltip id={`notRecogTooltip-${index}`} place="top" />
          <Tooltip id={`falselyGuessTooltip-${index}`} place="top" />
        </React.Fragment>
      ))}
    </>
  );
}

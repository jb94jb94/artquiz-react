import { useUserStats } from "../hooks/useUserData";

function formatTooltip(detail: Record<string, number> | null) {
  if (!detail) return "Keine Daten";
  return Object.entries(detail)
    .map(([name, count]) => `${count}× ${name}`)
    .join(", ");
}

export function StatsTable() {
  const { stats, loading } = useUserStats();

  if (loading) return <p>Statistiken werden geladen …</p>;

  return (
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
        {stats.map((row) => (
          <tr key={row.artist} className="border-t">
            <td className="p-2">{row.artist}</td>
            <td className="p-2">{row.correct}</td>
            <td className="p-2">
              <div title={formatTooltip(row.not_recognized_detail)}>
                {row.not_recognized}
              </div>
            </td>
            <td className="p-2">
              <div title={formatTooltip(row.falsely_guessed_detail)}>
                {row.falsely_guessed}
              </div>
            </td>
            <td className="p-2">{row.hit_rate.toFixed(1)}%</td>
            <td className="p-2">{row.precision_value.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
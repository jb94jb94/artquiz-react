import React from "react";
import { useUserStats } from "../hooks/useUserData";
import { useTable, useSortBy } from "react-table";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./StatsTable.css";

type UserStatRow = {
  artist_name: string;
  correct: number;
  not_recognized: number;
  not_recognized_detail: Record<string, number> | null;
  falsely_guessed: number;
  falsely_guessed_detail: Record<string, number> | null;
  hit_rate: number | null;
  precision_value: number | null;
};

function formatTooltip(detail: Record<string, number> | null): string {
  if (!detail) return "Keine Daten";
  return Object.entries(detail)
    .map(([name, count]) => `${count}× ${name}`)
    .join(", ");
}

function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return value.toFixed(1) + "%";
}

function renderTooltipCell(text: number, detail: Record<string, number> | null) {
  const id = `tooltip-${text}-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <>
      <span data-tooltip-id={id} data-tooltip-content={formatTooltip(detail)} style={{ cursor: "help" }}>
        {text}
      </span>
      <Tooltip id={id} place="top" />
    </>
  );
}

function computeF1ScorePercent(precisionPercent: number | null, recallPercent: number | null): number | null {
  if (precisionPercent === null || recallPercent === null) return null;
  const precision = precisionPercent / 100;
  const recall = recallPercent / 100;
  if (precision + recall === 0) return 0;
  const f1 = (2 * precision * recall) / (precision + recall);
  return f1 * 100; // zurück in Prozent
}


export function StatsTable() {
  const { stats, loading } = useUserStats();

  const data = React.useMemo(() => {
    return stats.map((row): UserStatRow => ({
      artist_name: row.artist_name || "(unbekannt)",
      correct: row.correct,
      not_recognized: row.not_recognized,
      not_recognized_detail: row.not_recognized_detail,
      falsely_guessed: row.falsely_guessed,
      falsely_guessed_detail: row.falsely_guessed_detail,
      hit_rate: row.hit_rate,
      precision_value: row.precision_value,
    }));
  }, [stats]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Künstler",
        accessor: "artist_name",
      },
      {
        Header: "Richtig",
        accessor: "correct",
      },
      {
        Header: "Nicht erkannt",
        accessor: "not_recognized",
        Cell: ({ row }: any) =>
          renderTooltipCell(row.original.not_recognized, row.original.not_recognized_detail),
      },
      {
        Header: "Fälschlich geraten",
        accessor: "falsely_guessed",
        Cell: ({ row }: any) =>
          renderTooltipCell(row.original.falsely_guessed, row.original.falsely_guessed_detail),
      },
      {
        Header: "Trefferquote",
        accessor: "hit_rate",
        Cell: ({ value }: any) => <span>{formatPercent(value)}</span>,
      },
      {
        Header: "Präzision",
        accessor: "precision_value",
        Cell: ({ value }: any) => <span>{formatPercent(value)}</span>,
      },
      {
  Header: "F1-Score",
  accessor: (row: UserStatRow) => computeF1ScorePercent(row.precision_value, row.hit_rate),
  id: "f1_score",
  Cell: ({ value }: any) => <span>{value !== null ? value.toFixed(1) + "%" : "-"}</span>,
}
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  if (loading) return <p>Statistiken werden geladen …</p>;

  return (
    <div className="stats-table-container">
      <table {...getTableProps()} className="stats-table">
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "desc"
                        : "asc"
                      : ""
                  }
                >
                  {column.render("Header")}
                  <span className="sort-indicator">
                    {column.isSorted ? (column.isSortedDesc ? " ↓" : " ↑") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
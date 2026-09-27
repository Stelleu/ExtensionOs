"use client";

import { useEffect, useRef } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
  type ScriptableContext,
} from "chart.js";
import {
  formatMonthLabel,
  formatRevenueAmount,
  type RevenueMonthRow,
} from "@/lib/revenue";

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

const INK = "#1A1614";
const MUTED = "#9C8E86";
const GRID = "#E8E0D8";
const GOLD = "#B8895A";

function depositGradient(ctx: ScriptableContext<"bar">) {
  const { chart } = ctx;
  const area = chart.chartArea;
  if (!area) return INK;
  const g = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
  g.addColorStop(0, "rgba(26, 22, 20, 0.55)");
  g.addColorStop(1, "rgba(26, 22, 20, 0.95)");
  return g;
}

function balanceGradient(ctx: ScriptableContext<"bar">) {
  const { chart } = ctx;
  const area = chart.chartArea;
  if (!area) return GOLD;
  const g = chart.ctx.createLinearGradient(0, area.bottom, 0, area.top);
  g.addColorStop(0, "rgba(184, 137, 90, 0.45)");
  g.addColorStop(1, "rgba(184, 137, 90, 0.85)");
  return g;
}

export function RevenueChart({ months }: { months: RevenueMonthRow[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const labels = months.map((m) =>
      formatMonthLabel(m.month_start).replace(/ \d{4}$/, "")
    );

    const chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Deposits collected",
            data: months.map((m) => m.deposits_collected),
            backgroundColor: depositGradient,
            hoverBackgroundColor: INK,
            borderRadius: { bottomLeft: 8, bottomRight: 8 },
            borderSkipped: false,
            maxBarThickness: 48,
            stack: "revenue",
          },
          {
            label: "Balance due at appointment",
            data: months.map((m) =>
              Math.max(0, m.service_value - m.deposits_collected)
            ),
            backgroundColor: balanceGradient,
            hoverBackgroundColor: GOLD,
            borderRadius: { topLeft: 8, topRight: 8 },
            borderSkipped: false,
            maxBarThickness: 48,
            stack: "revenue",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        animation: { duration: 700, easing: "easeOutQuart" },
        plugins: {
          legend: {
            position: "bottom",
            align: "start",
            labels: {
              color: MUTED,
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 8,
              boxHeight: 8,
              padding: 16,
              font: { size: 12 },
            },
          },
          tooltip: {
            backgroundColor: INK,
            titleColor: "#fff",
            bodyColor: "#E8E0D8",
            footerColor: MUTED,
            padding: 12,
            cornerRadius: 12,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              title: (items) =>
                items[0]
                  ? formatMonthLabel(months[items[0].dataIndex].month_start)
                  : "",
              label: (item) =>
                ` ${item.dataset.label}: ${formatRevenueAmount(Number(item.raw) || 0)}`,
              footer: (items) => {
                const row = items[0] ? months[items[0].dataIndex] : null;
                if (!row) return "";
                const count = row.booking_count;
                return [
                  `Service value: ${formatRevenueAmount(row.service_value)}`,
                  `${count} booking${count === 1 ? "" : "s"}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { color: MUTED, font: { size: 11 } },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: GRID },
            border: { display: false },
            ticks: {
              color: MUTED,
              font: { size: 11 },
              maxTicksLimit: 5,
              callback: (value) => formatRevenueAmount(Number(value)),
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [months]);

  return (
    <div className="relative h-64 w-full sm:h-80">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Deposits collected and balance due by month"
      />
    </div>
  );
}

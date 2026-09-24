import {
  formatMonthLabel,
  formatMomLabel,
  formatRevenueAmount,
  monthOverMonthPercent,
  type RevenueMonthRow,
} from "@/lib/revenue";

export function RevenueDashboard({ months }: { months: RevenueMonthRow[] }) {
  const current = months[months.length - 1];
  const previous = months.length > 1 ? months[months.length - 2] : null;

  const depositsMom = monthOverMonthPercent(
    current?.deposits_collected ?? 0,
    previous?.deposits_collected ?? 0
  );
  const depositsLabel = formatMomLabel(depositsMom);

  const maxDeposit = Math.max(
    1,
    ...months.map((m) => m.deposits_collected)
  );

  return (
    <div>
      <h1 className="font-serif text-4xl text-[#1A1614]">Revenue</h1>
      <p className="mt-2 text-sm text-[#6B5E58]">
        Actuals from paid deposits on confirmed and completed appointments —
        by appointment month. No forecasts.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Deposits collected"
          hint="This month"
          value={formatRevenueAmount(current?.deposits_collected ?? 0)}
        />
        <SummaryCard
          label="Service value"
          hint="This month · full booking totals"
          value={formatRevenueAmount(current?.service_value ?? 0)}
        />
        <SummaryCard
          label="Bookings counted"
          hint="Paid · confirmed / completed"
          value={String(current?.booking_count ?? 0)}
        />
      </div>

      <p
        className={`mt-4 text-sm font-medium ${
          depositsLabel.tone === "up"
            ? "text-emerald-700"
            : depositsLabel.tone === "down"
              ? "text-red-700"
              : "text-[#6B5E58]"
        }`}
      >
        {depositsLabel.tone === "up"
          ? "↑ "
          : depositsLabel.tone === "down"
            ? "↓ "
            : ""}
        Deposits {depositsLabel.text}
      </p>

      <section className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-[#1A1614]/5 sm:p-8">
        <h2 className="font-serif text-2xl text-[#1A1614]">
          Deposits by month
        </h2>
        <p className="mt-1 text-sm text-[#6B5E58]">
          Last {months.length} months · deposits collected
        </p>

        <div className="mt-8">
          <RevenueBarChart months={months} maxDeposit={maxDeposit} />
        </div>

        <ul className="mt-8 space-y-3 border-t border-[#E8E0D8] pt-6">
          {months.map((m) => (
            <li
              key={m.month_start}
              className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
            >
              <span className="font-medium text-[#1A1614]">
                {formatMonthLabel(m.month_start)}
              </span>
              <span className="text-[#6B5E58]">
                {formatRevenueAmount(m.deposits_collected)} deposits ·{" "}
                {formatRevenueAmount(m.service_value)} service · {m.booking_count}{" "}
                bookings
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  hint,
  value,
}: {
  label: string;
  hint: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-[#1A1614]/5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9C8E86]">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl text-[#1A1614]">{value}</p>
      <p className="mt-1 text-xs text-[#9C8E86]">{hint}</p>
    </div>
  );
}

function RevenueBarChart({
  months,
  maxDeposit,
}: {
  months: RevenueMonthRow[];
  maxDeposit: number;
}) {
  const width = 600;
  const height = 180;
  const padX = 24;
  const padTop = 12;
  const padBottom = 36;
  const chartH = height - padTop - padBottom;
  const chartW = width - padX * 2;
  const gap = 12;
  const barW =
    months.length > 0
      ? (chartW - gap * (months.length - 1)) / months.length
      : chartW;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full min-w-[320px]"
        role="img"
        aria-label="Deposits collected by month"
      >
        {months.map((m, i) => {
          const h =
            maxDeposit > 0
              ? (m.deposits_collected / maxDeposit) * chartH
              : 0;
          const x = padX + i * (barW + gap);
          const y = padTop + chartH - h;
          return (
            <g key={m.month_start}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, m.deposits_collected > 0 ? 2 : 0)}
                rx={6}
                fill="#1A1614"
              />
              <text
                x={x + barW / 2}
                y={height - 12}
                textAnchor="middle"
                className="fill-[#9C8E86]"
                style={{ fontSize: 11 }}
              >
                {formatMonthLabel(m.month_start).replace(/ \d{4}$/, "")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

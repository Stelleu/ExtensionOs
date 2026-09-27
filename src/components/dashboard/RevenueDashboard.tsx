import {
  formatMonthLabel,
  formatMomLabel,
  formatRevenueAmount,
  monthOverMonthPercent,
  type RevenueMonthRow,
} from "@/lib/revenue";
import { RevenueChart } from "@/components/dashboard/RevenueChart";

export function RevenueDashboard({ months }: { months: RevenueMonthRow[] }) {
  const current = months[months.length - 1];
  const previous = months.length > 1 ? months[months.length - 2] : null;

  const depositsMom = monthOverMonthPercent(
    current?.deposits_collected ?? 0,
    previous?.deposits_collected ?? 0
  );
  const depositsLabel = formatMomLabel(depositsMom);

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
          Revenue by month
        </h2>
        <p className="mt-1 text-sm text-[#6B5E58]">
          Last {months.length} months · each bar is the full service value,
          split into deposit collected and balance due
        </p>

        <div className="mt-8">
          <RevenueChart months={months} />
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

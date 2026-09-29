"use client";

import { Icon } from "../lib/icons";
import { formatEGP } from "../lib/format";
import { PRICING_CONFIG } from "../lib/config";

interface HourlyRatesProps {
  rate: number;
}

export function HourlyRates({ rate }: HourlyRatesProps) {
  const rates = [
    {
      key: "development",
      title: "تكلفة ساعة العمل الأساسية",
      subtitle: "(الجهد الأساسي للمشروع)",
      usd: PRICING_CONFIG.hourlyRateUSD,
      icon: "briefcase" as const,
      note: "تُحتسب ضمن تكلفة المشروع الإجمالية",
    },
    {
      key: "revisions",
      title: "تكلفة ساعة التعديلات الإضافية",
      subtitle: "(بعد استنفاد التعديل المجاني)",
      usd: PRICING_CONFIG.revisionRateUSD,
      icon: "wrench" as const,
      note: "تُحتسب فقط على التعديلات الإضافية",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {rates.map(({ key, title, subtitle, usd, icon, note }) => (
        <div
          key={key}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-surface-container/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-20 h-44 w-44 rounded-full bg-primary/[0.07] blur-3xl transition-opacity duration-500 group-hover:opacity-150"
          />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-on-surface">{title}</h3>
              <p className="mt-0.5 text-xs text-on-surface-variant">{subtitle}</p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <Icon name={icon} className="h-6 w-6" />
            </span>
          </div>

          <div className="relative mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-on-surface">
              {formatEGP(usd * rate)}
            </span>
            <span className="text-sm font-medium text-on-surface-variant">/ ساعة</span>
          </div>

          <div className="relative mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
              {formatUSDOrZero(usd)}$
            </span>
            <span className="text-xs text-on-surface-variant">× سعر الصرف</span>
            <span
              className="mr-auto truncate text-xs text-on-surface-variant/70"
              title={note}
            >
              {note}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatUSDOrZero(value: number): string {
  return value % 1 === 0 ? value.toString() : value.toFixed(1);
}

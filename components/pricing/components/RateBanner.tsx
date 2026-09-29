"use client";

import { Icon } from "../lib/icons";
import { useExchangeRate } from "../lib/useExchangeRate";
import { formatEGP } from "../lib/format";
import { PRICING_CONFIG } from "../lib/config";

export function RateBanner() {
  const { rate, status, error } = useExchangeRate();

  if (status === "loading") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-container/60 px-5 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/10" />
          <div className="flex-1">
            <div className="h-3.5 w-56 max-w-full animate-pulse rounded-full bg-white/10" />
            <div className="mt-2 h-3 w-40 max-w-full animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
        <SpinnerShimmer />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/30 bg-amber-400/[0.07] px-5 py-4 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300">
            <Icon name="cloud" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-relaxed text-amber-100">
              يتم حالياً عرض أسعار تقريبية بناءً على سعر صرف احتياطي
            </p>
            <p className="mt-1 text-xs leading-relaxed text-amber-200/70">
              تعذّر الاتصال بخدمة تحديث الأسعار ({error}). سعر الصرف الحالي
              المستخدَم: <span className="font-bold">{formatEGP(rate)}</span> لكل
              دولار. يتم تحديثه تلقائياً فور توفّر الاتصال.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.06] px-5 py-4 backdrop-blur-xl transition-colors hover:border-primary/40 hover:bg-primary/[0.09]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
          <span className="absolute inset-0 animate-ping rounded-xl bg-primary/20 [animation-duration:2.5s]" />
          <Icon name="cloud" className="relative h-5 w-5" />
        </span>
        <p className="flex-1 text-sm font-medium leading-relaxed text-on-surface">
          تم تحديث أسعار الصرف تلقائياً بناءً على السعر الحالي للـ USD:{" "}
          <span className="text-base font-extrabold text-primary">
            {formatEGP(rate)}
          </span>
          <span className="mr-1">لكل دولار</span>
          <span className="block text-xs text-on-surface-variant sm:inline sm:mr-2">
            {" "}
            — يتم الجلب ديناميكياً عبر Cloudflare Worker (zaitxcode-api)
          </span>
        </p>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
          مباشر
        </span>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-150"
      />
    </div>
  );
}

function SpinnerShimmer() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
    />
  );
}

export { PRICING_CONFIG };

"use client";

import { Icon } from "../lib/icons";
import { formatEGP, formatEGPRange, formatUSDRange, depositOf } from "../lib/format";
import { PRICING_CONFIG, PROJECT_MODELS, type ProjectModel } from "../lib/config";

interface PricingCardsProps {
  rate: number;
}

export function PricingCards({ rate }: PricingCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
      {PROJECT_MODELS.map((model, index) => (
        <PricingCard key={model.id} model={model} rate={rate} index={index} />
      ))}
    </div>
  );
}

interface PricingCardProps {
  model: ProjectModel;
  rate: number;
  index: number;
}

export function PricingCard({ model, rate, index }: PricingCardProps) {
  const minEGP = model.costUSD.min * rate;
  const maxEGP = model.costUSD.max * rate;
  const depositEGP = depositOf(minEGP + maxEGP, PRICING_CONFIG.depositPercentage) / 2;
  const depositUSD = depositOf(model.costUSD.min + model.costUSD.max, PRICING_CONFIG.depositPercentage) / 2;
  const isFeatured = Boolean(model.featured);

  return (
    <article
      className={[
        "group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300",
        "motion-reduce:transition-none",
        isFeatured
          ? "border-primary/40 bg-surface-container-high/80"
          : "border-white/10 bg-surface-container/60",
        "hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40",
        "lg:hover:-translate-y-3",
      ].join(" ")}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Ambient glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {isFeatured && (
        <span className="absolute left-0 top-6 inline-flex items-center gap-1.5 rounded-r-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-bold text-on-primary shadow-lg shadow-primary/30">
          <Icon name="rocket" className="h-3.5 w-3.5" />
          الأكثر طلباً
        </span>
      )}

      <div className="relative">
        <span
          className={[
            "grid h-14 w-14 place-items-center rounded-2xl border transition-all duration-300",
            "group-hover:scale-110 group-hover:-rotate-6",
            isFeatured
              ? "border-primary/30 bg-primary/15 text-primary"
              : "border-white/10 bg-white/5 text-primary",
          ].join(" ")}
        >
          <Icon name={model.icon} className="h-7 w-7" />
        </span>

        <h3 className="mt-5 text-xl font-bold text-on-surface">{model.name}</h3>
        <p className="text-sm font-medium text-primary">{model.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          {model.description}
        </p>

        <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-5">
          <div>
            <p className="text-xs font-medium text-on-surface-variant">
              إجمالي تكلفة المشروع
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-on-surface">
              {formatEGPRange(minEGP, maxEGP)}
            </p>
            <p className="mt-0.5 text-xs text-on-surface-variant">
              {formatUSDRange(model.costUSD.min, model.costUSD.max)} ≈{" "}
              {model.hours.min}-{model.hours.max} ساعة عمل
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-surface/60 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">المقدم المطلوب (50%)</span>
            <span className="font-bold text-on-surface">
              {formatEGP(depositEGP)}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full w-1/2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 group-hover:w-full" />
          </div>
          <p className="mt-2 text-xs text-on-surface-variant">
            والباقي {formatEGP(depositEGP)} فور التسليم النهائي
          </p>
        </div>

        <ul className="mt-6 space-y-3">
          {model.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm leading-relaxed text-on-surface-variant"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-3 w-3"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-6">
        <a
          href={`mailto:${PRICING_CONFIG.contactEmail}?subject=${encodeURIComponent(
            `طلب خدمة: ${model.name} — ${model.tagline}`,
          )}`}
          className={[
            "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold",
            "transition-all duration-300 motion-reduce:transition-none",
            "hover:scale-[1.02] active:scale-[0.98]",
            isFeatured
              ? "bg-gradient-to-r from-primary to-secondary text-on-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40"
              : "border border-white/15 bg-white/5 text-on-surface hover:border-primary/40 hover:bg-primary/10",
          ].join(" ")}
        >
          اطلب هذا النموذج
          <Icon name="rocket" className="h-4 w-4 -translate-x-0 transition-transform duration-300 group-hover:-translate-x-1" />
        </a>
      </div>
    </article>
  );
}

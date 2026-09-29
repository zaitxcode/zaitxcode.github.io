"use client";

import { useExchangeRate } from "./lib/useExchangeRate";
import { RateBanner } from "./components/RateBanner";
import { PricingCards } from "./components/PricingCard";
import { HourlyRates } from "./components/HourlyRates";
import { TermsSection } from "./components/TermsSection";
import { Icon } from "./lib/icons";
import { formatEGP } from "./lib/format";
import { PRICING_CONFIG } from "./lib/config";

export default function PricingPage() {
  const { rate } = useExchangeRate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-surface text-on-surface">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(60% 55% at 50% -10%, rgba(56,189,248,0.12) 0%, transparent 70%),
            radial-gradient(40% 40% at 85% 15%, rgba(168,85,247,0.08) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {/* Header */}
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px] shadow-primary" />
            ZAITXCODE — PRICING
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            أسعار شفافة
            <span className="block bg-gradient-to-r from-primary via-cyan-300 to-secondary bg-clip-text text-transparent">
              لتطوير الويب
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
            نماذج استرشادية تُحسب تلقائياً بالجنيه المصري بناءً على سعر صرف الدولار
            اللحظي — بدون رسوم خفية.
          </p>
        </header>

        {/* Live exchange-rate banner */}
        <div className="mt-10">
          <RateBanner />
        </div>

        {/* Pricing models */}
        <section aria-labelledby="pricing-heading" className="mt-16 scroll-mt-24">
          <SectionHeading
            id="pricing-heading"
            eyebrow="Project Estimations"
            title="نماذج المشاريع الاسترشادية"
            description="تُحسب التكلفة الإجمالية وقيمة المقدم (50%) بالجنيه المصري تلقائياً."
          />
          <PricingCards rate={rate} />
        </section>

        {/* Hourly rates */}
        <section aria-labelledby="hourly-heading" className="mt-20 scroll-mt-24">
          <SectionHeading
            id="hourly-heading"
            eyebrow="Hourly Rates"
            title="أسعار ساعات العمل"
            description="الجهد الفعلي لكل ساعة عمل — تتحدث ديناميكياً مع سعر الصرف."
          />
          <HourlyRates rate={rate} />
        </section>

        {/* Terms & conditions */}
        <section aria-labelledby="terms-heading" className="mt-20 scroll-mt-24">
          <SectionHeading
            id="terms-heading"
            eyebrow="Terms & Conditions"
            title="بنود وشروط الاتفاقية"
            description="سياسة واضحة وعادلة تضمن الشفافية الكاملة لجميع الأطراف."
          />
          <TermsSection />
        </section>

        {/* CTA */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface-container to-secondary/10 p-8 text-center sm:p-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(50% 60% at 50% 0%, rgba(56,189,248,0.15) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
                جاهز لبدء مشروعك القادم؟
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-on-surface-variant">
                أرسل تفاصيل مشروعك وسنعود إليك بعرض سعر مفصّل خلال 24 ساعة — المقدم
                المطلوب فقط <span className="font-bold text-primary">50%</span>.
              </p>
              <a
                href={`mailto:${PRICING_CONFIG.contactEmail}?subject=${encodeURIComponent(
                  "طلب عرض سعر — مشروع تطوير ويب",
                )}`}
                className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-secondary px-8 py-4 text-sm font-bold text-on-primary shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/50 active:scale-[0.98] motion-reduce:transition-none"
              >
                <Icon name="wallet" className="h-5 w-5" />
                اطلب عرض سعر مخصص
              </a>
              <p className="mt-5 text-xs text-on-surface-variant/70">
                {`جميع الأسعار محسوبة على سعر صرف ${formatEGP(rate)} لكل دولار`}
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-on-surface-variant/60">
            © {new Date().getFullYear()} ZaitXCode. جميع الحقوق محفوظة.
          </p>
        </footer>
      </div>
    </main>
  );
}

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}

function SectionHeading({ id, eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 text-center">
      <span
        id={id}
        className="text-xs font-bold uppercase tracking-[0.2em] text-primary"
      >
        {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-surface-variant">
        {description}
      </p>
    </div>
  );
}

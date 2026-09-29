# Pricing Page Component — ZaitXCode

صفحة أسعار "خدمات وأسعار تطوير المواقع" لـ Next.js (App Router) + Tailwind CSS.

## الاستخدام

```tsx
// app/pricing/page.tsx
import PricingPage from "@/components/pricing/PricingPage";

export default function Page() {
  return <PricingPage />;
}
```

## المتطلبات

1. نسخ `tailwind.config.ts` و `globals.css` إلى جذر مشروعك (أو دمجهما في ملفاتك الحالية).
2. إضافة مجلد `components/pricing/` بالكامل إلى مشروعك.

## هيكل الملفات

```
components/pricing/
├── PricingPage.tsx              # المكوّن الرئيسي
├── tailwind.config.ts           # ألوان Material Design 3 المخصصة
├── globals.css                  # متغيرات CSS للنظام اللوني
├── components/
│   ├── RateBanner.tsx           # بانر سعر الصرف (Loading/Error/Success)
│   ├── PricingCard.tsx          # بطاقات نماذج المشاريع
│   ├── HourlyRates.tsx          # أسعار ساعات العمل
│   └── TermsSection.tsx         # بنود وشروط الاتفاقية
└── lib/
    ├── config.ts                # الإعدادات والنماذج (USD + الساعات)
    ├── format.ts                # دوال التنسيق والحساب
    ├── icons.tsx                # أيقونات SVG مضمّنة
    └── useExchangeRate.ts       # Hook لجلب السعر من Cloudflare Worker
```

## نقاط مهمة

- **سعر الصرف**: يُجلب من `https://zaitxcode.com` (يتوقع `{"rate": 56.16}`).
- **الاحتياطي**: `56.16 ج.م` عند فشل الجلب أو انتهاء المهلة (8 ثوانٍ).
- **الحسابات**: `5$ × rate` للساعة الأساسية، `2.5$ × rate` للتعديلات.
- **المقدم**: `50%` من التكلفة، يُحسب ويعرض لكل نموذج.
- **التعديل**: غير القيم في `lib/config.ts` فقط — كل الحسابات تتبعها تلقائياً.

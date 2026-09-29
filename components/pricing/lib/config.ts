export const PRICING_CONFIG = {
  rateApiUrl: "https://zaitxcode.com",
  fallbackRate: 56.16,
  hourlyRateUSD: 5,
  revisionRateUSD: 2.5,
  depositPercentage: 0.5,
  requestTimeoutMs: 8000,
  contactEmail: "contact@zaitxcode.com",
} as const;

export type ProjectIcon = "rocket" | "briefcase" | "server";

export interface ProjectModel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  hours: { min: number; max: number };
  costUSD: { min: number; max: number };
  features: string[];
  icon: ProjectIcon;
  featured?: boolean;
}

export const PROJECT_MODELS: ProjectModel[] = [
  {
    id: "landing-page",
    name: "Landing Page",
    tagline: "صفحة هبوط احترافية",
    description:
      "صفحة تسويقية واحدة سريعة ومُحسّنة لتحويل الزوار إلى عملاء، مثالية للحملات الإعلانية وإطلاق المنتجات.",
    hours: { min: 15, max: 20 },
    costUSD: { min: 75, max: 100 },
    icon: "rocket",
    features: [
      "تصميم عصري متجاوب بالكامل مع جميع الشاشات",
      "تحسين سرعة التحميل وأداء SEO الأساسي",
      "نموذج تواصل وربط وسائل التواصل الاجتماعي",
      "تسليم خلال 3 إلى 5 أيام عمل",
    ],
  },
  {
    id: "standard-portfolio",
    name: "Standard Portfolio",
    tagline: "بورتفوليو متكامل",
    description:
      "موقع متعدد الصفحات يعرض أعمالك وخدماتك باحترافية، مع لوحة تحكم لإدارة المحتوى بسهولة.",
    hours: { min: 30, max: 40 },
    costUSD: { min: 150, max: 200 },
    icon: "briefcase",
    featured: true,
    features: [
      "حتى 6 صفحات مخصصة بالكامل",
      "لوحة تحكم لإدارة المحتوى بدون أكواد",
      "تكامل مع واتساب والبريد الإلكتروني",
      "تحسين متقدم لمحركات البحث (SEO)",
    ],
  },
  {
    id: "advanced-backend",
    name: "Advanced Backend",
    tagline: "نظام متقدم بالكامل",
    description:
      "تطبيق ويب متكامل بواجهات API آمنة وقاعدة بيانات ولوحة تحكم، مناسب للمنصات والخدمات الناشئة.",
    hours: { min: 50, max: 70 },
    costUSD: { min: 250, max: 350 },
    icon: "server",
    features: [
      "واجهات API آمنة وتصميم قاعدة بيانات احترافي",
      "لوحة تحكم كالية مع تقارير وإحصائيات",
      "مصادقة المستخدمين وبوابة دفع إلكتروني",
      "بنية تحتية قابلة للتوسع مستقبلاً",
    ],
  },
];

export interface TermItem {
  number: string;
  title: string;
  icon: "wallet" | "wrench" | "cloud";
  body: string;
}

export const TERMS: TermItem[] = [
  {
    number: "01",
    title: "الدفعة المالية",
    icon: "wallet",
    body: "نظام دفع مجزأ: 50% مقدم قبل البدء في العمل، و50% المتبقية فور التسليم النهائي وتأكيد المشروع.",
  },
  {
    number: "02",
    title: "التعديلات",
    icon: "wrench",
    body: "يحق للعميل الحصول على تعديل مجاني واحد (1) شامل بعد الاستلام، وأي تعديلات لاحقة تخضع لرسوم التعديل الإضافية بالساعة (2.5$ مضروبة في سعر الصرف الحالي).",
  },
  {
    number: "03",
    title: "التكاليف الخارجية",
    icon: "cloud",
    body: "أسعار الدومين والاستضافة تقع على عاتق العميل تماماً ويتم احتسابها ودفعها بشكل منفصل حسب اختيار المزود والنطاق المطلوبين.",
  },
];

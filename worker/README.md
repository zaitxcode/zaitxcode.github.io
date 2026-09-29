# ZaitXCode API — Cloudflare Worker

خدمة API تعرض سعر صرف الدولار (USD) مقابل الجنيه المصري (EGP) على المسار
`/usdegb.json` بهيكل JSON ثابت:

```json
{ "rate": 56.16 }
```

## المسارات

| المسار | الوصف |
|---|---|
| `/usdegb.json` | سعر الصرف الحالي (الاستخدام الرئيسي) |
| `/` | اختصار لنفس الاستجابة |
| `/health` | فحص الحالة + المصدر المستخدَم |
| `OPTIONS` | استجابة CORS Preflight |

## المصادر والاحتياط

1. `open.er-api.com/v6/latest/USD` (رئيسي — مجاني بدون مفتاح)
2. `api.exchangerate-api.com/v4/latest/USD` (احتياطي)
3. `56.16` (قيمة احتياطية ثابتة عند فشل الاثنين)

## التخزين المؤقت

- النتيجة تُخزَّن في **Cache API** الخاصة بـ Cloudflare لمدة `600` ثانية.
- عند انتهاء الصلاحية يُعاد الجلب من المصدر تلقائياً.

## النشر

```bash
cd worker
npm install
npx wrangler login
npx wrangler deploy
```

بعد النشر، اربط الـ Worker بنطاقك من لوحة Cloudflare:

**Workers Routes → Add route**
- Route: `zaitxcode.com/*`
- Zone: `zaitxcode.com`

أو أضف في `wrangler.toml`:

```toml
routes = [
  { pattern = "zaitxcode.com/*", zone_name = "zaitxcode.com" }
]
```

## الاختبار المحلي

```bash
npm run dev
# ثم افتح: http://localhost:8787/usdegb.json
```

## التكوين

كل القيم في `wrangler.toml` تحت `[vars]`:

| المتغير | الافتراضي | الوصف |
|---|---|---|
| `FALLBACK_RATE` | `56.16` | السعر الاحتياطي |
| `CACHE_TTL` | `600` | مدة التخزين المؤقت (ثانية) |
| `UPSTREAM_TIMEOUT_MS` | `8000` | مهلة طلب المصدر (مللي ثانية) |
| `PRIMARY_SOURCE` | open.er-api.com | المصدر الرئيسي |
| `SECONDARY_SOURCE` | exchangerate-api.com | المصدر الاحتياطي |

## مثال الاستجابة

```json
{
  "rate": 52.07,
  "source": "https://open.er-api.com/v6/latest/USD",
  "updated_at": "2026-09-29T00:02:31.000Z",
  "fresh": true
}
```

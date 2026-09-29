/**
 * ZaitXCode API — Cloudflare Worker
 *
 * يُصدِّر سعر صرف الدولار الأمريكي (USD) مقابل الجنيه المصري (EGP)
 * على مسار /usdegb.json بهيكل { "rate": 56.16 }.
 *
 * المصادر: open.er-api.com (رئيسي) → exchangerate-api.com (احتياطي)
 * مع تخزين مؤقت في Cloudflare Cache API لتقليل الطلبات.
 */

const FALLBACK_RATE = 56.16;
const CACHE_TTL = 600;
const UPSTREAM_TIMEOUT_MS = 8000;
const CACHE_KEY = "zaitxcode-api:usdegb";

const PRIMARY_SOURCE = "https://open.er-api.com/v6/latest/USD";
const SECONDARY_SOURCE = "https://api.exchangerate-api.com/v4/latest/USD";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Cache-Control": "public, max-age=600, s-maxage=600",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

function errorResponse(message, status = 500) {
  return jsonResponse({ error: message, rate: FALLBACK_RATE }, status);
}

/**
 * جلب سعر الصرف من مصدر واحد مع مهلة زمنية صارمة.
 */
async function fetchFromSource(url, env) {
  const timeoutMs = Number(env?.UPSTREAM_TIMEOUT_MS) || UPSTREAM_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cf: { cacheTtl: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const rate = Number(data?.rates?.EGP);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("EGP rate missing or invalid");
    }

    return rate;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * جلب السعر الحالي مع التبديل التلقائي بين المصادر.
 */
async function getCurrentRate(env) {
  const sources = [
    env?.PRIMARY_SOURCE || PRIMARY_SOURCE,
    env?.SECONDARY_SOURCE || SECONDARY_SOURCE,
  ];

  const errors = [];

  for (const source of sources) {
    try {
      const rate = await fetchFromSource(source, env);
      return { rate, source, fresh: true };
    } catch (error) {
      errors.push(`${source}: ${error.message}`);
    }
  }

  console.warn("All upstream sources failed:", errors.join(" | "));
  return {
    rate: Number(env?.FALLBACK_RATE) || FALLBACK_RATE,
    source: "fallback",
    fresh: false,
  };
}

/**
 * قراءة القيمة المخزّنة مؤقتاً (إن لم تنتهِ صلاحيتها).
 */
async function readCache(env) {
  try {
    const cache = caches.default;
    const cached = await cache.match(new Request(`https://cache.local/${CACHE_KEY}`));
    if (!cached) return null;

    const data = await cached.json();
    const age = (Date.now() - (data.cachedAt || 0)) / 1000;
    const ttl = Number(env?.CACHE_TTL) || CACHE_TTL;

    if (age > ttl) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * كتابة القيمة في التخزين المؤقت.
 */
async function writeCache(payload, env) {
  try {
    const cache = caches.default;
    const ttl = Number(env?.CACHE_TTL) || CACHE_TTL;
    await cache.put(
      new Request(`https://cache.local/${CACHE_KEY}`),
      new Response(JSON.stringify(payload), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `public, max-age=${ttl}, s-maxage=${ttl}`,
        },
      }),
    );
  } catch (error) {
    console.warn("Cache write failed:", error.message);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: JSON_HEADERS });
    }

    if (request.method !== "GET") {
      return errorResponse("Method not allowed. Use GET.", 405);
    }

    // مسار الحالة (للمراقبة)
    if (path === "/health") {
      const { rate, source } = await getCurrentRate(env);
      return jsonResponse({
        status: "ok",
        rate,
        source,
        timestamp: new Date().toISOString(),
      });
    }

    // المسار المطلوب: /usdegb.json
    if (
      path === "/usdegb.json" ||
      path === "/usd-egb.json" ||
      path === "/" ||
      path === "" ||
      path === "/index.json"
    ) {
      const cached = await readCache(env);

      if (cached) {
        return jsonResponse({
          rate: cached.rate,
          source: cached.source,
          updated_at: cached.cachedAtISO,
          cached: true,
        });
      }

      const { rate, source, fresh } = await getCurrentRate(env);

      const payload = {
        rate,
        source,
        cachedAt: Date.now(),
        cachedAtISO: new Date().toISOString(),
      };

      await writeCache(payload, env);

      return jsonResponse({
        rate,
        source,
        updated_at: payload.cachedAtISO,
        fresh,
      });
    }

    return errorResponse("Not found. Available: /usdegb.json, /health", 404);
  },
};

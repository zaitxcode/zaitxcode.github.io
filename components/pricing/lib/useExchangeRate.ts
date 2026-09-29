"use client";

import { useEffect, useState } from "react";
import { PRICING_CONFIG } from "./config";

export type RateStatus = "loading" | "success" | "error";

export interface ExchangeRateState {
  rate: number;
  status: RateStatus;
  error: string | null;
}

export function useExchangeRate(): ExchangeRateState {
  const [state, setState] = useState<ExchangeRateState>({
    rate: PRICING_CONFIG.fallbackRate,
    status: "loading",
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      PRICING_CONFIG.requestTimeoutMs,
    );

    let active = true;

    (async () => {
      try {
        const response = await fetch(PRICING_CONFIG.rateApiUrl, {
          signal: controller.signal,
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`فشل الاتصال بالخادم (رمز الحالة: ${response.status})`);
        }

        const data: unknown = await response.json();
        const rate = Number((data as { rate?: unknown })?.rate);

        if (!Number.isFinite(rate) || rate <= 0) {
          throw new Error("قيمة سعر الصرف المستلمة غير صالحة");
        }

        if (active) {
          setState({ rate, status: "success", error: null });
        }
      } catch (error) {
        if (!active) return;
        setState({
          rate: PRICING_CONFIG.fallbackRate,
          status: "error",
          error:
            error instanceof Error
              ? error.name === "AbortError"
                ? "انتهت مدة انتظار الطلب"
                : error.message
              : "خطأ غير متوقع",
        });
      } finally {
        clearTimeout(timeout);
      }
    })();

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return state;
}

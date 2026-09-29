const egpFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

export function formatEGP(amount: number): string {
  return `${egpFormatter.format(Math.round(amount))} ج.م`;
}

export function formatEGPRange(min: number, max: number): string {
  return `${formatEGP(min)} - ${formatEGP(max)}`;
}

export function formatUSD(amount: number): string {
  return `$${amount}`;
}

export function formatUSDRange(min: number, max: number): string {
  return `${formatUSD(min)} - ${formatUSD(max)}`;
}

export function depositOf(amount: number, percentage: number): number {
  return amount * percentage;
}

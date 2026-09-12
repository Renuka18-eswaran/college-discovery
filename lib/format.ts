export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLPA(lpa: number): string {
  return `₹${lpa.toFixed(1)} LPA`;
}

export function streamsList(streams: string): string[] {
  return streams.split(",").map((s) => s.trim()).filter(Boolean);
}

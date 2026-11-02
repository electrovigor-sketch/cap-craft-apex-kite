export type EcLevel = "L" | "M" | "Q" | "H";

export type QrSettings = {
  text: string;
  fg: string;
  bg: string;
  size: number;
  ec: EcLevel;
};

export const QR_DEFAULTS: QrSettings = {
  text: "https://example.com",
  fg: "#1c1915",
  bg: "#fffdf8",
  size: 320,
  ec: "M",
};

export const SIZE_MIN = 128;
export const SIZE_MAX = 1024;
export const SIZE_STEP = 16;
export const LOW_CONTRAST = 4;

export const STORAGE_KEY = "mohr-qr";

export const EC_LEVELS: { id: EcLevel; name: string; detail: string }[] = [
  { id: "L", name: "کم", detail: "۷٪" },
  { id: "M", name: "متوسط", detail: "۱۵٪" },
  { id: "Q", name: "زیاد", detail: "۲۵٪" },
  { id: "H", name: "حداکثر", detail: "۳۰٪" },
];

export const COLOR_PAIRS = [
  { id: "ink", label: "جوهر", fg: "#1c1915", bg: "#fffdf8" },
  { id: "classic", label: "کلاسیک", fg: "#111111", bg: "#ffffff" },
  { id: "night", label: "شب", fg: "#f4efe6", bg: "#1c1915" },
  { id: "clay", label: "سفال", fg: "#9a3412", bg: "#f8f1e7" },
] as const;

export const SAMPLES = [
  { id: "url", label: "نشانی وب", value: "https://example.com" },
  { id: "fa", label: "متن فارسی", value: "سلام، این یک کد QR است." },
  { id: "tel", label: "شماره تماس", value: "tel:+982112345678" },
] as const;

const HEX = /^#[0-9a-fA-F]{6}$/;

export function isHex(value: string): boolean {
  return HEX.test(value);
}

export function normalizeHex(raw: string): string | null {
  const trimmed = raw.trim();
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return isHex(withHash) ? withHash.toLowerCase() : null;
}

export function clampSize(size: number): number {
  if (!Number.isFinite(size)) return QR_DEFAULTS.size;
  const stepped = Math.round(size / SIZE_STEP) * SIZE_STEP;
  return Math.min(SIZE_MAX, Math.max(SIZE_MIN, stepped));
}

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

export function loadSettings(): QrSettings | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<QrSettings>;
    const ec = data.ec;
    return {
      text: typeof data.text === "string" ? data.text : QR_DEFAULTS.text,
      fg: typeof data.fg === "string" && isHex(data.fg) ? data.fg.toLowerCase() : QR_DEFAULTS.fg,
      bg: typeof data.bg === "string" && isHex(data.bg) ? data.bg.toLowerCase() : QR_DEFAULTS.bg,
      size: typeof data.size === "number" ? clampSize(data.size) : QR_DEFAULTS.size,
      ec: ec === "L" || ec === "M" || ec === "Q" || ec === "H" ? ec : QR_DEFAULTS.ec,
    };
  } catch {
    return null;
  }
}

export function qrErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "";
  if (/too big|too long|overflow|maximum/i.test(raw)) {
    return "این متن برای سطح تصحیح خطای انتخاب‌شده طولانی است. سطح را کمتر کنید یا متن را کوتاه کنید.";
  }
  return "ساخت کد ممکن نشد. متن را عوض کنید و دوباره امتحان کنید.";
}

export function looksLikeBareHost(value: string): boolean {
  return /^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(value.trim());
}

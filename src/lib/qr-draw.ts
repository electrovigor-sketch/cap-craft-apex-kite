import type { EcLevel } from "@/lib/qr-settings";

type QrApi = {
  toDataURL: (
    text: string,
    options?: {
      errorCorrectionLevel?: EcLevel;
      margin?: number;
      width?: number;
      color?: { dark?: string; light?: string };
    },
  ) => Promise<string>;
};

export async function renderQrDataUrl(options: {
  text: string;
  fg: string;
  bg: string;
  size: number;
  ec: EcLevel;
}): Promise<string> {
  const mod = await import("qrcode");
  const api: QrApi = (mod as { default?: QrApi }).default ?? (mod as unknown as QrApi);
  return api.toDataURL(options.text, {
    errorCorrectionLevel: options.ec,
    margin: 4,
    width: options.size,
    color: { dark: options.fg, light: options.bg },
  });
}

export function downloadDataUrl(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

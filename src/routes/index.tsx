import { createFileRoute } from "@tanstack/react-router";
import { QrStudio } from "@/components/qr-studio";
import { renderQrDataUrl } from "@/lib/qr-draw";
import { QR_DEFAULTS } from "@/lib/qr-settings";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await renderQrDataUrl(QR_DEFAULTS);
    } catch {
      return "";
    }
  },
  component: Home,
});

function Home() {
  const initialSrc = Route.useLoaderData();
  return <QrStudio initialSrc={initialSrc} />;
}

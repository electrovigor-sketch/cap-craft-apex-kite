import { useEffect, useId, useState } from "react";
import { Download, QrCode } from "lucide-react";
import { downloadDataUrl, renderQrDataUrl } from "@/lib/qr-draw";
import {
  COLOR_PAIRS,
  EC_LEVELS,
  LOW_CONTRAST,
  QR_DEFAULTS,
  SAMPLES,
  SIZE_MAX,
  SIZE_MIN,
  SIZE_STEP,
  STORAGE_KEY,
  clampSize,
  contrastRatio,
  loadSettings,
  looksLikeBareHost,
  normalizeHex,
  qrErrorMessage,
  type EcLevel,
} from "@/lib/qr-settings";

type Phase = "pending" | "empty" | "ready" | "error";

export function QrStudio({ initialSrc }: { initialSrc: string }) {
  const [text, setText] = useState(QR_DEFAULTS.text);
  const [fg, setFg] = useState(QR_DEFAULTS.fg);
  const [bg, setBg] = useState(QR_DEFAULTS.bg);
  const [size, setSize] = useState(QR_DEFAULTS.size);
  const [ec, setEc] = useState<EcLevel>(QR_DEFAULTS.ec);
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>(initialSrc ? "ready" : "pending");
  const [error, setError] = useState("");
  const [src, setSrc] = useState(initialSrc);
  const [downloaded, setDownloaded] = useState(false);
  const samplesId = useId();
  const pairsId = useId();

  useEffect(() => {
    const saved = loadSettings();
    if (saved) {
      setText(saved.text);
      setFg(saved.fg);
      setBg(saved.bg);
      setSize(saved.size);
      setEc(saved.ec);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ text, fg, bg, size, ec }));
  }, [hydrated, text, fg, bg, size, ec]);

  useEffect(() => {
    if (text.trim() === "") {
      setPhase("empty");
      setError("");
      setSrc("");
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const url = await renderQrDataUrl({ text, fg, bg, size, ec });
          if (cancelled) return;
          setSrc(url);
          setPhase("ready");
          setError("");
        } catch (err) {
          if (cancelled) return;
          setPhase("error");
          setError(qrErrorMessage(err));
        }
      })();
    }, 40);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [text, fg, bg, size, ec]);

  useEffect(() => {
    if (!downloaded) return;
    const timer = window.setTimeout(() => setDownloaded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [downloaded]);

  const contrast = contrastRatio(fg, bg);
  const lowContrast = contrast < LOW_CONTRAST;
  const bareHost = looksLikeBareHost(text);
  const status = statusMessage(phase, error, lowContrast);

  function onDownload() {
    if (!src || phase !== "ready") return;
    downloadDataUrl(src, "mohr-qr.png");
    setDownloaded(true);
  }

  return (
    <div className="min-h-screen">
      <div className="h-1 bg-primary" aria-hidden="true" />
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Mark />
          <div>
            <h1 className="text-xl font-bold leading-tight text-balance">مهر</h1>
            <p className="text-sm text-pretty text-muted">
              کد QR، همان لحظه که می‌نویسید
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-2 lg:items-start lg:gap-6 lg:py-8">
        <section
          aria-labelledby="preview-title"
          className="order-1 rounded-lg border border-border bg-surface p-4 lg:col-start-2 lg:row-start-1 lg:p-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="preview-title" className="text-base font-medium">
              پیش‌نمایش زنده
            </h2>
            <p className="text-sm text-muted tabular-nums">
              {size.toLocaleString("fa-IR")} پیکسل
            </p>
          </div>

          <div className="relative mt-4 flex min-h-64 w-full items-center justify-center rounded-md border border-border bg-sheet p-4">
            {phase === "ready" && src ? (
              <img
                src={src}
                alt="پیش‌نمایش کد QR"
                className="qr-bitmap"
                style={{ ["--qr-px" as string]: `${size}px` }}
              />
            ) : (
              <QrCode className="size-10 text-muted" aria-hidden="true" />
            )}
          </div>

          <p
            role="status"
            aria-live="polite"
            className={
              "mt-3 min-h-6 text-sm text-pretty " + (lowContrast && phase === "ready" ? "text-primary" : "text-muted")
            }
          >
            {status}
          </p>

          <button
            type="button"
            onClick={onDownload}
            disabled={phase !== "ready"}
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-medium text-primary-fg transition-colors duration-200 disabled:opacity-50"
          >
            <Download className="size-5" aria-hidden="true" />
            {downloaded ? "PNG ذخیره شد" : "دانلود PNG"}
          </button>
        </section>

        <form
          className="order-2 rounded-lg border border-border bg-surface p-4 lg:col-start-1 lg:row-start-1 lg:p-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label htmlFor="payload" className="text-sm font-medium">
              متن یا نشانی
            </label>
            <textarea
              id="payload"
              dir="auto"
              rows={4}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="نشانی یا هر متنی"
              autoComplete="off"
              spellCheck={false}
              aria-describedby={bareHost ? "payload-hint payload-url" : "payload-hint"}
              className="mt-2 w-full resize-y rounded-md border border-border bg-sheet px-3 py-3 text-base leading-relaxed text-fg"
            />
            <p id="payload-hint" className="mt-2 text-sm text-muted tabular-nums">
              {text.length.toLocaleString("fa-IR")} نویسه
            </p>
            {bareHost ? (
              <p id="payload-url" className="mt-1 text-sm text-pretty text-muted">
                برای باز شدن سایت بعد از اسکن، https:// را اول نشانی بگذارید.
              </p>
            ) : null}
          </div>

          <div className="mt-5">
            <p id={samplesId} className="text-sm font-medium">
              نمونه‌ها
            </p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby={samplesId}>
              {SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setText(sample.value)}
                  aria-pressed={text === sample.value}
                  className={
                    "min-h-11 rounded-md border px-3 text-sm transition-colors duration-200 " +
                    (text === sample.value
                      ? "border-primary bg-primary text-primary-fg"
                      : "border-border bg-sheet text-fg")
                  }
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p id={pairsId} className="text-sm font-medium">
              ترکیب رنگ
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-labelledby={pairsId}>
              {COLOR_PAIRS.map((pair) => {
                const selected = fg === pair.fg && bg === pair.bg;
                return (
                  <button
                    key={pair.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setFg(pair.fg);
                      setBg(pair.bg);
                    }}
                    className={
                      "flex min-h-11 items-center gap-2 rounded-md border px-2 text-sm transition-colors duration-200 " +
                      (selected
                        ? "border-primary bg-primary text-primary-fg"
                        : "border-border bg-sheet text-fg")
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 overflow-hidden rounded-sm border border-border"
                    >
                      <span className="w-1/2" style={{ backgroundColor: pair.fg }} />
                      <span className="w-1/2" style={{ backgroundColor: pair.bg }} />
                    </span>
                    {pair.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ColorField id="fg" label="رنگ پیش‌زمینه" value={fg} onChange={setFg} />
            <ColorField id="bg" label="رنگ پس‌زمینه" value={bg} onChange={setBg} />
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="size" className="text-sm font-medium">
                اندازه
              </label>
              <span className="text-sm text-muted tabular-nums">
                {size.toLocaleString("fa-IR")} پیکسل
              </span>
            </div>
            <input
              id="size"
              type="range"
              min={SIZE_MIN}
              max={SIZE_MAX}
              step={SIZE_STEP}
              value={size}
              onChange={(event) => setSize(clampSize(Number(event.target.value)))}
              aria-valuemin={SIZE_MIN}
              aria-valuemax={SIZE_MAX}
              aria-valuenow={size}
              aria-valuetext={`${size.toLocaleString("fa-IR")} پیکسل`}
              className="mt-3 h-11 w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted tabular-nums">
              <span>{SIZE_MIN.toLocaleString("fa-IR")}</span>
              <span>{SIZE_MAX.toLocaleString("fa-IR")}</span>
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium">سطح تصحیح خطا</legend>
            <p id="ec-hint" className="mt-1 text-sm text-pretty text-muted">
              سطح بالاتر کد را شلوغ‌تر می‌کند، ولی لک و خراش را بهتر تحمل می‌کند.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-describedby="ec-hint">
              {EC_LEVELS.map((level) => {
                const selected = ec === level.id;
                return (
                  <label
                    key={level.id}
                    className={
                      "flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-md border px-2 py-2 text-center transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring " +
                      (selected
                        ? "border-primary bg-primary text-primary-fg"
                        : "border-border bg-sheet text-fg")
                    }
                  >
                    <input
                      type="radio"
                      name="error-correction"
                      value={level.id}
                      checked={selected}
                      onChange={() => setEc(level.id)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{level.name}</span>
                    <span className={"text-xs tabular-nums " + (selected ? "" : "text-muted")}>
                      {level.detail}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </form>
      </main>
    </div>
  );
}

function statusMessage(phase: Phase, error: string, lowContrast: boolean): string {
  if (phase === "pending") return "در حال ساخت پیش‌نمایش…";
  if (phase === "empty") return "متنی وارد نشده. با نوشتن، کد همین‌جا ساخته می‌شود.";
  if (phase === "error") return error;
  if (lowContrast) return "کد آماده است، اما کنتراست رنگ‌ها کم است و ممکن است اسکن نشود.";
  return "کد آمادهٔ دانلود است.";
}

function Mark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-10 shrink-0 grid-cols-3 gap-0.5 rounded-md border border-border bg-sheet p-1.5"
    >
      <span className="bg-fg" />
      <span />
      <span className="bg-fg" />
      <span />
      <span className="bg-primary" />
      <span />
      <span className="bg-fg" />
      <span />
      <span className="bg-fg" />
    </span>
  );
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const invalid = normalizeHex(draft) === null;

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value.toLowerCase())}
          className="size-12 shrink-0 cursor-pointer rounded-md border border-border bg-sheet p-1"
        />
        <input
          id={`${id}-hex`}
          dir="ltr"
          value={draft}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label={`کد هگز ${label}`}
          aria-invalid={invalid}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            const hex = normalizeHex(next);
            if (hex) onChange(hex);
          }}
          onBlur={() => {
            if (!normalizeHex(draft)) setDraft(value);
          }}
          className={
            "h-12 min-w-0 flex-1 rounded-md border bg-sheet px-3 text-base tabular-nums text-fg " +
            (invalid ? "border-primary" : "border-border")
          }
        />
      </div>
    </div>
  );
}

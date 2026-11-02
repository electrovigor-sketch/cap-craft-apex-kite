import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as QrCode, r as Download } from "../_libs/lucide-react.mjs";
import { a as QR_DEFAULTS, c as STORAGE_KEY, d as loadSettings, f as looksLikeBareHost, g as renderQrDataUrl, h as downloadDataUrl, i as EC_LEVELS, l as clampSize, m as qrErrorMessage, n as Route, o as SAMPLES, p as normalizeHex, r as COLOR_PAIRS, s as SIZE_MAX, u as contrastRatio } from "./router-6REf8-Qh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B5nyxrOV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QrStudio({ initialSrc }) {
	const [text, setText] = (0, import_react.useState)(QR_DEFAULTS.text);
	const [fg, setFg] = (0, import_react.useState)(QR_DEFAULTS.fg);
	const [bg, setBg] = (0, import_react.useState)(QR_DEFAULTS.bg);
	const [size, setSize] = (0, import_react.useState)(QR_DEFAULTS.size);
	const [ec, setEc] = (0, import_react.useState)(QR_DEFAULTS.ec);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [phase, setPhase] = (0, import_react.useState)(initialSrc ? "ready" : "pending");
	const [error, setError] = (0, import_react.useState)("");
	const [src, setSrc] = (0, import_react.useState)(initialSrc);
	const [downloaded, setDownloaded] = (0, import_react.useState)(false);
	const samplesId = (0, import_react.useId)();
	const pairsId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify({
			text,
			fg,
			bg,
			size,
			ec
		}));
	}, [
		hydrated,
		text,
		fg,
		bg,
		size,
		ec
	]);
	(0, import_react.useEffect)(() => {
		if (text.trim() === "") {
			setPhase("empty");
			setError("");
			setSrc("");
			return;
		}
		let cancelled = false;
		const timer = window.setTimeout(() => {
			(async () => {
				try {
					const url = await renderQrDataUrl({
						text,
						fg,
						bg,
						size,
						ec
					});
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
	}, [
		text,
		fg,
		bg,
		size,
		ec
	]);
	(0, import_react.useEffect)(() => {
		if (!downloaded) return;
		const timer = window.setTimeout(() => setDownloaded(false), 1600);
		return () => window.clearTimeout(timer);
	}, [downloaded]);
	const lowContrast = contrastRatio(fg, bg) < 4;
	const bareHost = looksLikeBareHost(text);
	const status = statusMessage(phase, error, lowContrast);
	function onDownload() {
		if (!src || phase !== "ready") return;
		downloadDataUrl(src, "mohr-qr.png");
		setDownloaded(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1 bg-primary",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold leading-tight text-balance",
						children: "مهر"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-pretty text-muted",
						children: "کد QR، همان لحظه که می‌نویسید"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-5xl gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-2 lg:items-start lg:gap-6 lg:py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "preview-title",
					className: "order-1 rounded-lg border border-border bg-surface p-4 lg:col-start-2 lg:row-start-1 lg:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "preview-title",
								className: "text-base font-medium",
								children: "پیش‌نمایش زنده"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted tabular-nums",
								children: [size.toLocaleString("fa-IR"), " پیکسل"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mt-4 flex min-h-64 w-full items-center justify-center rounded-md border border-border bg-sheet p-4",
							children: phase === "ready" && src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: "پیش‌نمایش کد QR",
								className: "qr-bitmap",
								style: { ["--qr-px"]: `${size}px` }
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
								className: "size-10 text-muted",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "status",
							"aria-live": "polite",
							className: "mt-3 min-h-6 text-sm text-pretty " + (lowContrast && phase === "ready" ? "text-primary" : "text-muted"),
							children: status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onDownload,
							disabled: phase !== "ready",
							className: "mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-base font-medium text-primary-fg transition-colors duration-200 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-5",
								"aria-hidden": "true"
							}), downloaded ? "PNG ذخیره شد" : "دانلود PNG"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "order-2 rounded-lg border border-border bg-surface p-4 lg:col-start-1 lg:row-start-1 lg:p-6",
					onSubmit: (event) => event.preventDefault(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "payload",
								className: "text-sm font-medium",
								children: "متن یا نشانی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "payload",
								dir: "auto",
								rows: 4,
								value: text,
								onChange: (event) => setText(event.target.value),
								placeholder: "نشانی یا هر متنی",
								autoComplete: "off",
								spellCheck: false,
								"aria-describedby": bareHost ? "payload-hint payload-url" : "payload-hint",
								className: "mt-2 w-full resize-y rounded-md border border-border bg-sheet px-3 py-3 text-base leading-relaxed text-fg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								id: "payload-hint",
								className: "mt-2 text-sm text-muted tabular-nums",
								children: [text.length.toLocaleString("fa-IR"), " نویسه"]
							}),
							bareHost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: "payload-url",
								className: "mt-1 text-sm text-pretty text-muted",
								children: "برای باز شدن سایت بعد از اسکن، https:// را اول نشانی بگذارید."
							}) : null
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: samplesId,
								className: "text-sm font-medium",
								children: "نمونه‌ها"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								role: "group",
								"aria-labelledby": samplesId,
								children: SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setText(sample.value),
									"aria-pressed": text === sample.value,
									className: "min-h-11 rounded-md border px-3 text-sm transition-colors duration-200 " + (text === sample.value ? "border-primary bg-primary text-primary-fg" : "border-border bg-sheet text-fg"),
									children: sample.label
								}, sample.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								id: pairsId,
								className: "text-sm font-medium",
								children: "ترکیب رنگ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 grid grid-cols-2 gap-2",
								role: "group",
								"aria-labelledby": pairsId,
								children: COLOR_PAIRS.map((pair) => {
									const selected = fg === pair.fg && bg === pair.bg;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										"aria-pressed": selected,
										onClick: () => {
											setFg(pair.fg);
											setBg(pair.bg);
										},
										className: "flex min-h-11 items-center gap-2 rounded-md border px-2 text-sm transition-colors duration-200 " + (selected ? "border-primary bg-primary text-primary-fg" : "border-border bg-sheet text-fg"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											"aria-hidden": "true",
											className: "flex size-6 shrink-0 overflow-hidden rounded-sm border border-border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-1/2",
												style: { backgroundColor: pair.fg }
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-1/2",
												style: { backgroundColor: pair.bg }
											})]
										}), pair.label]
									}, pair.id);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								id: "fg",
								label: "رنگ پیش‌زمینه",
								value: fg,
								onChange: setFg
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorField, {
								id: "bg",
								label: "رنگ پس‌زمینه",
								value: bg,
								onChange: setBg
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: "size",
										className: "text-sm font-medium",
										children: "اندازه"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm text-muted tabular-nums",
										children: [size.toLocaleString("fa-IR"), " پیکسل"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "size",
									type: "range",
									min: 128,
									max: SIZE_MAX,
									step: 16,
									value: size,
									onChange: (event) => setSize(clampSize(Number(event.target.value))),
									"aria-valuemin": 128,
									"aria-valuemax": SIZE_MAX,
									"aria-valuenow": size,
									"aria-valuetext": `${size.toLocaleString("fa-IR")} پیکسل`,
									className: "mt-3 h-11 w-full accent-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs text-muted tabular-nums",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: 128 .toLocaleString("fa-IR") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: SIZE_MAX.toLocaleString("fa-IR") })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "mt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "text-sm font-medium",
									children: "سطح تصحیح خطا"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									id: "ec-hint",
									className: "mt-1 text-sm text-pretty text-muted",
									children: "سطح بالاتر کد را شلوغ‌تر می‌کند، ولی لک و خراش را بهتر تحمل می‌کند."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4",
									"aria-describedby": "ec-hint",
									children: EC_LEVELS.map((level) => {
										const selected = ec === level.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-md border px-2 py-2 text-center transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring " + (selected ? "border-primary bg-primary text-primary-fg" : "border-border bg-sheet text-fg"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "error-correction",
													value: level.id,
													checked: selected,
													onChange: () => setEc(level.id),
													className: "sr-only"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium",
													children: level.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs tabular-nums " + (selected ? "" : "text-muted"),
													children: level.detail
												})
											]
										}, level.id);
									})
								})
							]
						})
					]
				})]
			})
		]
	});
}
function statusMessage(phase, error, lowContrast) {
	if (phase === "pending") return "در حال ساخت پیش‌نمایش…";
	if (phase === "empty") return "متنی وارد نشده. با نوشتن، کد همین‌جا ساخته می‌شود.";
	if (phase === "error") return error;
	if (lowContrast) return "کد آماده است، اما کنتراست رنگ‌ها کم است و ممکن است اسکن نشود.";
	return "کد آمادهٔ دانلود است.";
}
function Mark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		"aria-hidden": "true",
		className: "grid size-10 shrink-0 grid-cols-3 gap-0.5 rounded-md border border-border bg-sheet p-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-fg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-fg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-fg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bg-fg" })
		]
	});
}
function ColorField({ id, label, value, onChange }) {
	const [draft, setDraft] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		setDraft(value);
	}, [value]);
	const invalid = normalizeHex(draft) === null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		htmlFor: id,
		className: "text-sm font-medium",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			type: "color",
			value,
			onChange: (event) => onChange(event.target.value.toLowerCase()),
			className: "size-12 shrink-0 cursor-pointer rounded-md border border-border bg-sheet p-1"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: `${id}-hex`,
			dir: "ltr",
			value: draft,
			spellCheck: false,
			autoCapitalize: "off",
			autoCorrect: "off",
			"aria-label": `کد هگز ${label}`,
			"aria-invalid": invalid,
			onChange: (event) => {
				const next = event.target.value;
				setDraft(next);
				const hex = normalizeHex(next);
				if (hex) onChange(hex);
			},
			onBlur: () => {
				if (!normalizeHex(draft)) setDraft(value);
			},
			className: "h-12 min-w-0 flex-1 rounded-md border bg-sheet px-3 text-base tabular-nums text-fg " + (invalid ? "border-primary" : "border-border")
		})]
	})] });
}
function Home() {
	const initialSrc = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrStudio, { initialSrc });
}
//#endregion
export { Home as component };

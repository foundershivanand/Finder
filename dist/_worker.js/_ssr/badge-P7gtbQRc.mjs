import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./app-header-YYYCmjB6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-P7gtbQRc.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-card-2 text-muted",
		money: "bg-money/15 text-money",
		pain: "bg-pain/15 text-pain",
		outline: "border border-border text-muted",
		primary: "bg-primary/15 text-primary"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };

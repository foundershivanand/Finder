import { C as require_jsx_runtime, b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$1 } from "./router-D0ZHGnoZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/startup._slug-DqPo8y6d.js
var import_jsx_runtime = require_jsx_runtime();
function StartupRedirect() {
	const { slug } = Route$1.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/hit/$kind/$id",
		params: {
			kind: "trustmrr",
			id: slug
		},
		replace: true
	});
}
//#endregion
export { StartupRedirect as component };

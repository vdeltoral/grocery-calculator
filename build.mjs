import { cp, mkdir, rm } from "node:fs/promises";

const ds = "node_modules/@vdeltoral/design-system";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/ds", { recursive: true });
await cp("index.html", "dist/index.html");
await cp("app.js", "dist/app.js");
await cp("app.css", "dist/app.css");
await cp("conversions.json", "dist/conversions.json");
await cp(`${ds}/tokens/tokens.css`, "dist/ds/tokens.css");
await cp(`${ds}/web/ds-core.css`, "dist/ds/ds-core.css");
await cp(`${ds}/web/ds.css`, "dist/ds/ds.css");
await cp(`${ds}/web/ds.js`, "dist/ds/ds.js");

import { describe, it, expect, beforeAll } from "vitest";
import { build } from "vite";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(__dirname, "..");
const outDir = join(root, "dist");

// Runs the real library build; vite.config.ts isn't covered by `tsc`, so a
// renamed/ignored plugin option only shows up in the emitted files.
// Builds into dist/: the dts plugin takes its outDir from tsconfig, not Vite.
describe("library build", () => {
  beforeAll(async () => {
    await build({
      root,
      configFile: join(root, "vite.config.ts"),
      logLevel: "silent",
    });
  }, 60_000);

  it("emits a single bundled declaration file", async () => {
    const dts = (await readdir(outDir)).filter((f) => f.endsWith(".d.ts"));
    expect(dts).toEqual(["index.d.ts"]);
  });

  it("bundled declarations are self-contained and cover the public API", async () => {
    const dts = await readFile(join(outDir, "index.d.ts"), "utf8");
    expect(dts).not.toMatch(/from\s+["']\.\.?\//);
    for (const name of [
      "generateSnowflake",
      "generateSnowflakeSync",
      "FlurryOptions",
      "SnowflakeParams",
    ]) {
      expect(dts).toContain(name);
    }
  });
});

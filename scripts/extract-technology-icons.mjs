import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const spritePath = path.join(projectRoot, "public", "assets", "icons", "sprite.svg");
const outputDirectory = path.join(projectRoot, "public", "assets", "game", "technologies");

const technologySymbols = {
  html: "lang-html",
  css: "lang-css",
  javascript: "lang-js",
  typescript: "lang-ts",
  react: "lang-react",
  vue: "lang-vue",
  git: "lang-git",
};

const sprite = await readFile(spritePath, "utf8");

await mkdir(outputDirectory, { recursive: true });

for (const [technologyId, symbolId] of Object.entries(technologySymbols)) {
  const symbolPattern = new RegExp(
    `<symbol id="${symbolId}" viewBox="([^"]+)"[^>]*>([\\s\\S]*?)<\\/symbol>`,
  );
  const match = sprite.match(symbolPattern);

  if (!match) {
    throw new Error(`Symbol ${symbolId} was not found in ${spritePath}`);
  }

  const [, viewBox, contents] = match;
  const standaloneSvg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="${viewBox}">`,
    contents.trim(),
    "</svg>",
    "",
  ].join("\n");

  await writeFile(path.join(outputDirectory, `${technologyId}.svg`), standaloneSvg, "utf8");
}

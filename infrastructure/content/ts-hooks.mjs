// Les sources de l'API importent leurs voisins en « ./x.js » (sortie de tsc).
// Pour les lire directement en TypeScript depuis les générateurs, on résout
// « x.js » vers « x.ts » quand seul le .ts existe.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, next) {
  if (specifier.startsWith(".") && specifier.endsWith(".js") && context.parentURL?.endsWith(".ts")) {
    const ts = new URL(specifier.replace(/\.js$/, ".ts"), context.parentURL);
    if (existsSync(fileURLToPath(ts))) return next(ts.href, context);
  }
  return next(specifier, context);
}

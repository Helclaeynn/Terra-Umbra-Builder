import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    {
      // Le site lit les règles de Vérité servies par l'API : pas les catalogues du code dans le paquet.
      name: "regles-verite-depuis-api",
      enforce: "pre",
      resolveId(source, importer) {
        if (source === "./core-rules.js" && importer && /[\/]rules[\/]truth[\/]active\.ts$/.test(importer))
          return this.resolve("/src/lib/truth-rules-empty.ts", importer, { skipSelf: true });
      }
    }
  ]
});

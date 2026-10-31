// node --import ./infrastructure/content/ts-register.mjs infrastructure/content/build-….mjs
import { register } from "node:module";

register("./ts-hooks.mjs", import.meta.url);

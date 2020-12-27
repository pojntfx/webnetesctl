import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import hashbang from "rollup-plugin-hashbang";
import {
  binMain,
  binSource,
  main,
  module,
  source,
  types,
} from "./package.json";

const bundle = (format) => ({
  input: source,
  inlineDynamicImports: true,
  output: {
    file: format == "cjs" ? main : format == "dts" ? types : module,
    format: format == "cjs" ? "cjs" : "es",
    sourcemap: format != "dts",
  },
  plugins: format == "dts" ? [dts(), json()] : [esbuild(), json()],
  external: (id) => !/^[./]/.test(id),
});

const bundleBin = () => ({
  input: binSource,
  inlineDynamicImports: true,
  output: {
    file: binMain,
    format: "cjs",
    sourcemap: false,
  },
  plugins: [esbuild(), hashbang(), json()],
  external: (id) => !/^[./]/.test(id),
});

export default [bundle("es"), bundle("cjs"), bundle("dts"), bundleBin()];

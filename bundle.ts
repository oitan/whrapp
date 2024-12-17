import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const _result = await esbuild.build({
    plugins: [...denoPlugins()],
    entryPoints: ["https://deno.land/std@0.224.0/bytes/mod.ts"],
    outfile: "./out/bytes.esm.js",
    bundle: true,
    format: "esm",
});

esbuild.stop();

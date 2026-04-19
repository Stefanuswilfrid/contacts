import { defineNitroConfig } from "nitro/config";

/** Local: `node-server` for `vite preview`. On Vercel, `VERCEL=1` selects the Vercel Build Output API preset. */
export default defineNitroConfig({
  preset: process.env.VERCEL ? "vercel" : "node-server",
});

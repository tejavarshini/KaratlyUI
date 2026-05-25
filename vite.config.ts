import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const rawPort = process.env.PORT ?? "5173";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH ?? "/";
const isCapacitor = process.env.CAPACITOR_BUILD === 'true';

export default defineConfig(async () => {
  const plugins = [react(), tailwindcss()];

  if (process.env.NODE_ENV !== "production") {
    try {
      const { default: runtimeErrorOverlay } = await import(
        "@replit/vite-plugin-runtime-error-modal"
      );
      plugins.push(runtimeErrorOverlay());
    } catch {
      // Optional in non-Replit/local setups.
    }
  }

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const cartographerPkg = "@replit/" + "vite-plugin-cartographer";
      const devBannerPkg = "@replit/" + "vite-plugin-dev-banner";
      const [{ cartographer }, { devBanner }] = await Promise.all([
        import(cartographerPkg),
        import(devBannerPkg),
      ]);

      plugins.push(
        cartographer({
          root: path.resolve(import.meta.dirname, ".."),
        }),
        devBanner(),
      );
    } catch {
      // Optional in non-Replit/local setups.
    }
  }

  return {
    base: isCapacitor ? './' : basePath,
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: false,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});

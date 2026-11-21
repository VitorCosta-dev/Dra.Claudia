import vinext from "vinext";
import { defineConfig, loadEnv } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { readExecutionProfile } from "./scripts/execution-profile.mjs";
import { sites } from "./build/sites-vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cdnAdapter } from "@vinext/cloudflare/cache/cdn-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const managedLinux = readExecutionProfile() === "managed-linux";

const localBindingConfig = {
  main: "vinext/server/fetch-handler",
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async ({ mode, command }) => {
  // Expose only the public Supabase values in the browser bundle.
  // Some vinext client environments do not replace NEXT_PUBLIC_* by default.
  const localEnv = loadEnv(mode, process.cwd(), "");
  const publicSupabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || localEnv.NEXT_PUBLIC_SUPABASE_URL || "";
  const publicSupabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    localEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";
  // Use Miniflare's local Request.cf placeholder unless fetching is requested.
  process.env.CLOUDFLARE_CF_FETCH_ENABLED ??= "false";
  process.env.WRANGLER_SEND_METRICS ??= "false";

  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.WRANGLER_REGISTRY_PATH ??= ".wrangler/dev-registry";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // The Cloudflare/Miniflare plugin is required for production builds, but its
  // worker introspection can fail with ECONNRESET on Windows during local dev.
  // vinext already provides the local development server, so keep Cloudflare
  // out of `pnpm dev` and preserve it for build/deploy.
  const cloudflarePlugin = command === "build"
    ? (await import("@cloudflare/vite-plugin")).cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: localBindingConfig,
      })
    : null;

  return {
    envPrefix: ["VITE_", "NEXT_PUBLIC_"],
    define: {
      "import.meta.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(publicSupabaseUrl),
      "import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicSupabaseKey),
      "process.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(publicSupabaseUrl),
      "process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(publicSupabaseKey),
    },
    server: {
      ...(managedLinux ? { host: "0.0.0.0", allowedHosts: ["terminal.local"] } : {}),
      ...(isCodexSeatbeltSandbox ? { watch: { useFsEvents: false, usePolling: true } } : {}),
    },
    plugins: [
      vinext({
        cache: { data: kvDataAdapter(), cdn: cdnAdapter() },
        images: { optimizer: imagesOptimizer() },
        prerender: { routes: "*" },
      }),
      sites({ mockAuth: !managedLinux }),
      ...(cloudflarePlugin ? [cloudflarePlugin] : []),
    ],
  };
});


import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

export default async (_req: Request, context: Context) => {
  const key = context.params.key;
  const image = await getStore("product-images").get(key, { type: "arrayBuffer" });
  if (!image) return new Response("Not found", { status: 404 });
  const ext = key.split(".").pop() ?? "jpg";
  return new Response(image, {
    headers: {
      "Content-Type": TYPES[ext] ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const config: Config = { path: "/api/images/:key", method: "GET" };

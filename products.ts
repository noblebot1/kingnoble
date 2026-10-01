import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";
import { isAuthorized } from "./_auth.js";

const images = () => getStore("product-images");
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

function toJSON(p: typeof products.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    price: Number(p.price),
    image: p.imageKey ? `/api/images/${p.imageKey}` : null,
  };
}

async function saveImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return undefined;
  const ext = EXT[file.type];
  if (!ext) throw new Error("Unsupported image type");
  const key = `${randomUUID()}.${ext}`;
  await images().set(key, await file.arrayBuffer());
  return key;
}

function readFields(form: FormData) {
  const title = String(form.get("title") ?? "").trim();
  const price = Number(form.get("price"));
  if (!title) throw new Error("Product name is required");
  if (!Number.isFinite(price) || price < 0) throw new Error("Price must be a valid number");
  return {
    title,
    price: price.toFixed(2),
    description: String(form.get("description") ?? "").trim(),
    category: String(form.get("category") ?? "").trim() || "General",
  };
}

export default async (req: Request, context: Context) => {
  const id = context.params.id ? Number(context.params.id) : undefined;

  if (req.method === "GET") {
    const rows = await db.select().from(products).orderBy(desc(products.createdAt));
    return Response.json(rows.map(toJSON));
  }

  if (!isAuthorized(req)) return Response.json({ error: "Wrong code" }, { status: 401 });

  try {
    if (req.method === "POST" && !id) {
      const form = await req.formData();
      const fields = readFields(form);
      const imageKey = await saveImage(form.get("image"));
      const [row] = await db.insert(products).values({ ...fields, imageKey }).returning();
      return Response.json(toJSON(row), { status: 201 });
    }

    if (!id) return new Response("Not found", { status: 404 });
    const [existing] = await db.select().from(products).where(eq(products.id, id));
    if (!existing) return Response.json({ error: "Product not found" }, { status: 404 });

    if (req.method === "PUT") {
      const form = await req.formData();
      const fields = readFields(form);
      const imageKey = await saveImage(form.get("image"));
      if (imageKey && existing.imageKey) await images().delete(existing.imageKey);
      const [row] = await db
        .update(products)
        .set({ ...fields, ...(imageKey ? { imageKey } : {}) })
        .where(eq(products.id, id))
        .returning();
      return Response.json(toJSON(row));
    }

    if (req.method === "DELETE") {
      await db.delete(products).where(eq(products.id, id));
      if (existing.imageKey) await images().delete(existing.imageKey);
      return Response.json({ ok: true });
    }
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: ["/api/products", "/api/products/:id"] };

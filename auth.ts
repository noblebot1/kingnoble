import type { Config } from "@netlify/functions";
import { isAuthorized } from "./_auth.js";

export default async (req: Request) => {
  if (!isAuthorized(req)) return Response.json({ error: "Wrong code" }, { status: 401 });
  return Response.json({ ok: true });
};

export const config: Config = { path: "/api/auth", method: "POST" };

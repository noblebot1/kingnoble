import { isAuthorized } from "./_auth.js";

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Wrong code retard" }, { status: 401 });
  }
  return Response.json({ ok: true });
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return Response.json({ error: "Wrong code retard" }, { status: 401 });
  }
  return Response.json({ ok: true });
}

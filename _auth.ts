import { timingSafeEqual } from "node:crypto";

// Owner code for the product manager. Can be overridden with the ADMIN_CODE env var.
const ADMIN_CODE = process.env.ADMIN_CODE || "591900";

export function isAuthorized(req: Request) {
  const given = Buffer.from(req.headers.get("x-admin-code") ?? "");
  const expected = Buffer.from(ADMIN_CODE);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

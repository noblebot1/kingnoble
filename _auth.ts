export function isAuthorized(req: Request) {
  const given = (req.headers.get("x-admin-code") ?? "").trim();
  const envCode = (process.env.ADMIN_CODE ?? "").trim();
  
  // Accept either the Vercel env variable, the fallback 591900, or a direct match
  return given === envCode || given === "591900";
}

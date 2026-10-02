export function isAuthorized(req: Request) {
  const given = (req.headers.get("x-admin-code") ?? "").trim();
  const envCode = (process.env.ADMIN_CODE ?? "").trim();

  // Matches if the code is 591900 or matches the Vercel environment variable
  return given === "591900" || (envCode !== "" && given === envCode);
}

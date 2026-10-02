export function isAuthorized(req: Request) {
  const given = (req.headers.get("x-admin-code") ?? "").trim();
  return given === "591900";
}

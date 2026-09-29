export function getClientInfo(request: Request) {
  const userAgent = request.headers.get("user-agent");

  const forwardedFor = request.headers.get("x-forwarded-for");

  const ipAddress =
    forwardedFor?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;

  return {
    userAgent,
    ipAddress,
  };
}

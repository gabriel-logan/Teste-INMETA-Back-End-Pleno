export function parseSafeIp(ip: string | undefined): string {
  if (!ip) {
    return "unknown";
  }

  return ip.length > 45 ? ip.slice(0, 45) : ip; // Max length for IPv6
}

export function parseSafeUserAgent(userAgent: string | undefined): string {
  if (!userAgent) {
    return "unknown";
  }

  return userAgent.length > 300 ? userAgent.slice(0, 300) : userAgent;
}

export function parseSafeAcceptHeader(accept: string | undefined): string {
  if (!accept) {
    return "unknown";
  }

  return accept.length > 300 ? accept.slice(0, 300) : accept;
}

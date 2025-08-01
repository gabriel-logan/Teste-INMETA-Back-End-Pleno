import {
  parseSafeAcceptHeader,
  parseSafeIp,
  parseSafeUserAgent,
} from "./parse-safe-headers";
describe("parseSafeIp", () => {
  it("should return 'unknown' if ip is undefined", () => {
    expect(parseSafeIp(undefined)).toBe("unknown");
  });

  it("should return the ip if length <= 45", () => {
    const ip = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
    expect(parseSafeIp(ip)).toBe(ip);
  });

  it("should truncate the ip if length > 45", () => {
    const longIp = "a".repeat(50);
    expect(parseSafeIp(longIp)).toBe(longIp.slice(0, 45));
  });
});

describe("parseSafeUserAgent", () => {
  it("should return 'unknown' if userAgent is undefined", () => {
    expect(parseSafeUserAgent(undefined)).toBe("unknown");
  });

  it("should return the userAgent if length <= 300", () => {
    const ua = "Mozilla/5.0";
    expect(parseSafeUserAgent(ua)).toBe(ua);
  });

  it("should truncate the userAgent if length > 300", () => {
    const longUa = "b".repeat(350);
    expect(parseSafeUserAgent(longUa)).toBe(longUa.slice(0, 300));
  });
});

describe("parseSafeAcceptHeader", () => {
  it("should return '' if accept is undefined", () => {
    expect(parseSafeAcceptHeader(undefined)).toBe("");
  });

  it("should return the accept header if length <= 300", () => {
    const accept = "application/json";
    expect(parseSafeAcceptHeader(accept)).toBe(accept);
  });

  it("should truncate the accept header if length > 300", () => {
    const longAccept = "c".repeat(350);
    expect(parseSafeAcceptHeader(longAccept)).toBe(longAccept.slice(0, 300));
  });
});

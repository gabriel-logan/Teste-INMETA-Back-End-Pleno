import generateTrackerFingerprint from "./tracker-fingerprint";

describe("generateTrackerFingerprint", () => {
  it("should generate a SHA-1 fingerprint for a given payload", () => {
    const payload = "test-payload";
    const fingerprint = generateTrackerFingerprint(payload);
    expect(fingerprint).toBeDefined();
  });

  it("should return different fingerprints for different payloads", () => {
    const payload1 = "payload-one";
    const payload2 = "payload-two";
    const fingerprint1 = generateTrackerFingerprint(payload1);
    const fingerprint2 = generateTrackerFingerprint(payload2);
    expect(fingerprint1).not.toBe(fingerprint2);
  });

  it("should return the same fingerprint for the same payload", () => {
    const payload = "consistent-payload";
    const fingerprint1 = generateTrackerFingerprint(payload);
    const fingerprint2 = generateTrackerFingerprint(payload);
    expect(fingerprint1).toBe(fingerprint2);
  });

  it("should handle empty string payload", () => {
    const fingerprint = generateTrackerFingerprint("");
    expect(typeof fingerprint).toBe("string");
    expect(fingerprint.length).toBe(40); // SHA-1 hex length
  });
});

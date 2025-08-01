import { createHash } from "crypto";

export default function generateTrackerFingerprint(payload: string): string {
  const fingerprint = createHash("sha1").update(payload).digest("hex");

  return fingerprint;
}

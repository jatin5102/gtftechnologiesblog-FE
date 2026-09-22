
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://blog.gtftechnologies.com"
).replace(/\/$/, "");

// A slug is only usable in a URL if it is a non-empty string. The literal
// "undefined"/"null" checks catch values that were stringified upstream.
const isUsableSegment = (value) =>
  typeof value === "string" &&
  value.trim() !== "" &&
  value.trim() !== "undefined" &&
  value.trim() !== "null";
export const blogPath = (...segments) => {
  if (!segments.length || !segments.every(isUsableSegment)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[blogPath] link skipped — unusable slug segment(s):",
        segments.map((segment) => (isUsableSegment(segment) ? segment : `>>> ${String(segment)} <<<`)),
      );
    }
    return null;
  }
  return `/${segments.map((segment) => segment.trim()).join("/")}/`;
};

export const absoluteUrl = (path) => {
  if (!isUsableSegment(path)) return null;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

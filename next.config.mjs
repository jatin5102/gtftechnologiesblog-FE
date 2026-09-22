/** @type {import('next').NextConfig} */

// URLs that are already in the index but no longer resolve. Redirecting them
// (rather than letting them 404) passes their link equity to the live page and
// clears them out of Search Console.
//
// `source` is written without a trailing slash; with `trailingSlash: true` Next
// normalises the incoming path before matching, so `/404` also matches `/404/`.
const legacyRedirects = [
  // Post slug was renamed — the old slug no longer resolves in the API.
  {
    source: "/social-media/video-marketing-for-real-estate",
    destination: "/social-media/real-estate-video-marketing/",
  },
  // The not-found page was reachable on its own URL and answered 200, so it got
  // crawled as a soft 404. Unmatched routes still render it normally: Next
  // renders the 404 component internally instead of requesting this path.
  {
    source: "/404",
    destination: "/",
  },
  // Links built from missing slugs produced /undefined/... paths (fixed at the
  // source in src/lib/urls.js; this clears the ones already crawled).
  {
    source: "/undefined",
    destination: "/",
  },
  {
    source: "/undefined/:path*",
    destination: "/",
  },
];

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    domains: ['api-blog.gtftechnologies.com', 'localhost'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  async redirects() {
    return legacyRedirects.map((redirect) => ({ ...redirect, permanent: true }));
  },
};

export default nextConfig;

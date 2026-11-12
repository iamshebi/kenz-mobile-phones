/** @type {import("next").NextConfig} */
const noindex = [
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
  { key: "Cache-Control", value: "no-store" },
];
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/accessories", destination: "/shop", permanent: true },
      { source: "/ar/accessories", destination: "/ar/shop", permanent: true },
    ];
  },
  // Admin dashboard: static page in /public, served at /admin
  async rewrites() {
    return [{ source: "/admin", destination: "/admin.html" }];
  },
  async headers() {
    return [
      { source: "/admin", headers: [...noindex, { key: "X-Frame-Options", value: "DENY" }, { key: "Referrer-Policy", value: "same-origin" }] },
      { source: "/admin.html", headers: [...noindex, { key: "X-Frame-Options", value: "DENY" }, { key: "Referrer-Policy", value: "same-origin" }] },
      { source: "/admin.(js|css)", headers: [{ key: "Cache-Control", value: "no-cache" }, { key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/api/:path*", headers: noindex },
    ];
  },
};

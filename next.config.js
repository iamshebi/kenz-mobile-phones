/** @type {import("next").NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/accessories", destination: "/shop", permanent: true },
      { source: "/ar/accessories", destination: "/ar/shop", permanent: true },
    ];
  },
};

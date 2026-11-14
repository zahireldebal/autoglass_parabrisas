/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // CSS crítico inline: evita el request de CSS que bloquea el render
  experimental: { inlineCss: true },
};
export default nextConfig;

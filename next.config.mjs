// Fully static build: `npm run build` writes the whole site to /out,
// which any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages) can serve.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // The Next image optimizer needs a server; static export serves files as-is.
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

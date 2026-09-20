/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  // Only the custom domain is indexed; Vercel-generated hosts stay out of search.
  async headers() {
    return [
      // Media in `public/` keeps its name across deploys, so it cannot be
      // immutable the way `/_next/static` is. A day fresh, then served stale
      // while it revalidates: a returning visitor stops re-asking for every
      // cover, and a replaced file still lands within a visit or two.
      {
        source: '/:all*(mp4|webm|webp|jpg|png|svg)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=2592000' },
        ],
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<host>.*\\.vercel\\.app)' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default nextConfig

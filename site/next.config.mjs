/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // The optimiser is on: this stopped being a static export when the llms
    // routes and the middleware arrived, and with it off every `<Image>` was
    // serving its authored file — 1920x1200 covers into boxes of ~540px, which
    // Lighthouse counted as ~217 KiB of waste on the home alone.
    // `unoptimized` survives per call site, and the client logos keep it:
    // they are small, already tuned by hand, and some are SVG.
    formats: ['image/avif', 'image/webp'],
    // 90 rather than the default 75: this is a design portfolio, and the
    // covers are dark frames with gradients, where 75 shows. Measured on the
    // console kit cover at the width a retina screen asks for, AVIF at 90 is
    // 59 KB against the 88 KB of the authored file, so the quality is kept and
    // the page still gets lighter. The list has to name every quality used,
    // and 75 stays for anything that does not ask.
    qualities: [75, 90],
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

import { EnglishProvider } from '@/components/providers/EnglishProvider'
import { SiteLayout, siteMetadata, siteViewport } from '../_site/SiteLayout'
import '../globals.css'

export const viewport = siteViewport
export const metadata = siteMetadata('en')

/** Root layout for English, served unprefixed. */
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteLayout locale="en" Provider={EnglishProvider}>
      {children}
    </SiteLayout>
  )
}

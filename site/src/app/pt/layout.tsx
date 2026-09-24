import { PortugueseProvider } from '@/components/providers/PortugueseProvider'
import { SiteLayout, siteMetadata, siteViewport } from '../_site/SiteLayout'
import '../globals.css'

export const viewport = siteViewport
export const metadata = siteMetadata('pt')

/** Root layout for Portuguese, under `/pt`. */
export default function PortugueseLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteLayout locale="pt" Provider={PortugueseProvider}>
      {children}
    </SiteLayout>
  )
}

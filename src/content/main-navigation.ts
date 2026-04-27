export interface MainNavItem {
  href: string
  title: string
}

// TODO: /philosophy page is in the canonical circuit but the route doesn't
// exist yet. Create the page (or filter this list) when /philosophy lands.
// /projects (index) and /contact intentionally excluded for now.
export const MAIN_NAVIGATION: MainNavItem[] = [
  { href: '/', title: 'Home' },
  { href: '/about', title: 'About' },
  { href: '/experience', title: 'Experience' },
  { href: '/philosophy', title: 'Philosophy' },
]

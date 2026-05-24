export interface MainNavItem {
  href: string
  title: string
}

// /contact intentionally excluded — opens via overlay from MenuSection /
// FloatingContactButton, not as a standalone routed page.
export const MAIN_NAVIGATION: MainNavItem[] = [
  { href: '/', title: 'Home' },
  { href: '/about', title: 'About' },
  { href: '/experience', title: 'Experience' },
  { href: '/projects', title: 'Projects' },
  { href: '/philosophy', title: 'Philosophy' },
]

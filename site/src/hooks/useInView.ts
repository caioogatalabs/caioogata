'use client'
import { useEffect, useRef } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean // default true — only triggers once
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('-inview')
          if (once) observer.unobserve(el)
        } else if (!once) {
          el.classList.remove('-inview')
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return ref
}

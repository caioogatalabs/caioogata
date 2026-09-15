'use client'

import { createContext, useContext, useState, useRef, useCallback, useMemo, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastState {
  message: string
  type: ToastType
  id: number
}

interface ToastContextValue {
  toast: ToastState | null
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue>({
  toast: null,
  showToast: () => {},
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idRef = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 4000) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    idRef.current += 1
    setToast({ message, type, id: idRef.current })
    timerRef.current = setTimeout(() => setToast(null), duration)
  }, [])

  return (
    <ToastContext.Provider value={{ toast, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  return useContext(ToastContext)
}

export function useToast() {
  const { showToast } = useToastContext()
  return useMemo(() => ({
    success: (message: string, options?: { duration?: number }) =>
      showToast(message, 'success', options?.duration),
    error: (message: string, options?: { duration?: number }) =>
      showToast(message, 'error', options?.duration),
    info: (message: string, options?: { duration?: number }) =>
      showToast(message, 'info', options?.duration),
  }), [showToast])
}

'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

interface VideoEmbedProps {
  platform: 'youtube' | 'vimeo'
  videoId: string
  className?: string
}

const UNMUTE_EVENT = 'portfolio:video-unmuted'

function getEmbedUrl(platform: 'youtube' | 'vimeo', videoId: string): string {
  if (platform === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}&enablejsapi=1`
  }
  return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&title=0&byline=0&portrait=0&controls=0&loop=1&background=1`
}

function sendMute(iframe: HTMLIFrameElement, platform: 'youtube' | 'vimeo') {
  if (platform === 'youtube') {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'mute', args: '' }),
      '*'
    )
  } else {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ method: 'setVolume', value: 0 }),
      'https://player.vimeo.com'
    )
  }
}

function sendUnmute(iframe: HTMLIFrameElement, platform: 'youtube' | 'vimeo') {
  if (platform === 'youtube') {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'unMute', args: '' }),
      '*'
    )
  } else {
    iframe.contentWindow?.postMessage(
      JSON.stringify({ method: 'setVolume', value: 1 }),
      'https://player.vimeo.com'
    )
  }
}

export default function VideoEmbed({ platform, videoId, className = '' }: VideoEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isMutedRef = useRef(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoKey = `${platform}-${videoId}`

  // Listen for other videos unmuting — auto-mute this one if it's currently playing
  useEffect(() => {
    const handleOtherUnmuted = (e: Event) => {
      const { key } = (e as CustomEvent<{ key: string }>).detail
      if (key === videoKey || isMutedRef.current) return
      const iframe = iframeRef.current
      if (!iframe) return
      sendMute(iframe, platform)
      isMutedRef.current = true
      setIsMuted(true)
    }

    window.addEventListener(UNMUTE_EVENT, handleOtherUnmuted)
    return () => window.removeEventListener(UNMUTE_EVENT, handleOtherUnmuted)
  }, [platform, videoKey])

  const toggleMute = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    if (isMutedRef.current) {
      // Unmuting — notify others first, then unmute this one
      window.dispatchEvent(new CustomEvent(UNMUTE_EVENT, { detail: { key: videoKey } }))
      sendUnmute(iframe, platform)
      isMutedRef.current = false
      setIsMuted(false)
    } else {
      sendMute(iframe, platform)
      isMutedRef.current = true
      setIsMuted(true)
    }
  }, [platform, videoKey])

  return (
    <div className="group relative w-full h-full">
      <iframe
        ref={iframeRef}
        src={getEmbedUrl(platform, videoId)}
        className={`w-full h-full border-0 ${className}`}
        allow="autoplay; encrypted-media"
        allowFullScreen
        loading="lazy"
        title={`${platform} video ${videoId}`}
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/50 border border-white/10 text-white/30 opacity-0 group-hover:opacity-100 hover:text-white/80 hover:border-white/30 hover:bg-black/70 transition-all duration-200 font-mono text-xs rounded-sm backdrop-blur-sm select-none"
        aria-label={isMuted ? 'Ativar áudio' : 'Silenciar'}
        title={isMuted ? 'Ativar áudio' : 'Silenciar'}
      >
        {isMuted ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        )}
        <span>{isMuted ? 'unmute' : 'mute'}</span>
      </button>
    </div>
  )
}

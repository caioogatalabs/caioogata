'use client'

interface VideoEmbedProps {
  platform: 'youtube' | 'vimeo'
  videoId: string
  className?: string
}

function getEmbedUrl(platform: 'youtube' | 'vimeo', videoId: string): string {
  if (platform === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`
  }
  return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&title=0&byline=0&portrait=0&controls=0&loop=1&background=1`
}

export default function VideoEmbed({ platform, videoId, className = '' }: VideoEmbedProps) {
  return (
    <iframe
      src={getEmbedUrl(platform, videoId)}
      className={`w-full h-full border-0 ${className}`}
      allow="autoplay; encrypted-media"
      allowFullScreen
      loading="lazy"
      title={`${platform} video ${videoId}`}
    />
  )
}

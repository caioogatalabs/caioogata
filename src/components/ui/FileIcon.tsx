'use client'

import { motion } from 'motion/react'

interface FileIconProps {
  onClick: () => void
  label?: string
  variant?: 'image' | 'video'
  className?: string
}

function ImageIconSvg() {
  return (
    <svg
      width="64"
      height="72"
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors"
    >
      {/* Document body */}
      <path
        d="M4 4H44L56 16V68H4V4Z"
        fill="#454546"
        stroke="#636364"
        strokeWidth="2"
      />
      {/* Folded corner */}
      <path
        d="M44 4L56 16H44V4Z"
        fill="#636364"
        stroke="#636364"
        strokeWidth="1"
      />
      {/* Image preview area */}
      <rect
        x="12"
        y="22"
        width="36"
        height="28"
        fill="#161618"
        stroke="#636364"
        strokeWidth="1"
      />
      {/* Mountain/landscape icon */}
      <path
        d="M16 46L24 34L30 40L38 30L44 46H16Z"
        fill="#454546"
        className="group-hover:fill-primary/40 transition-colors"
      />
      {/* Sun circle */}
      <circle
        cx="38"
        cy="30"
        r="3"
        fill="#636364"
        className="group-hover:fill-primary/60 transition-colors"
      />
    </svg>
  )
}

function VideoIconSvg() {
  return (
    <svg
      width="64"
      height="72"
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors"
    >
      {/* Document body */}
      <path
        d="M4 4H44L56 16V68H4V4Z"
        fill="#454546"
        stroke="#636364"
        strokeWidth="2"
      />
      {/* Folded corner */}
      <path
        d="M44 4L56 16H44V4Z"
        fill="#636364"
        stroke="#636364"
        strokeWidth="1"
      />
      {/* Video preview area */}
      <rect
        x="12"
        y="22"
        width="36"
        height="28"
        fill="#161618"
        stroke="#636364"
        strokeWidth="1"
      />
      {/* Play triangle */}
      <path
        d="M25 30L39 36L25 42V30Z"
        fill="#636364"
        className="group-hover:fill-primary/60 transition-colors"
      />
      {/* Film strip holes top */}
      <rect x="14" y="24" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
      <rect x="20" y="24" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
      <rect x="37" y="24" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
      <rect x="43" y="24" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
      {/* Film strip holes bottom */}
      <rect x="14" y="45" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
      <rect x="20" y="45" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
      <rect x="37" y="45" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
      <rect x="43" y="45" width="3" height="3" rx="0.5" fill="#454546" className="group-hover:fill-primary/30 transition-colors" />
    </svg>
  )
}

export default function FileIcon({ onClick, label = 'profile.jpg', variant = 'image', className = '' }: FileIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`group flex flex-col items-center gap-1.5 p-2 rounded-sm transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Open ${variant} editor for ${label}`}
    >
      {variant === 'video' ? <VideoIconSvg /> : <ImageIconSvg />}
      <span className="text-xs font-mono text-neutral-300 group-hover:text-primary transition-colors">
        {label}
      </span>
    </motion.button>
  )
}

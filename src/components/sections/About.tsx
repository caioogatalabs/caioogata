'use client'

import { useState, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import ArrowRightIcon from '@/components/ui/ArrowRightIcon'
import FileIcon from '@/components/ui/FileIcon'
import ImageEditorWindow from '@/components/ui/ImageEditorWindow'
import VideoEditorWindow from '@/components/ui/VideoEditorWindow'

export default function About() {
  const { content } = useLanguage()
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false)
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="text-left relative"
    >
      {/* Title row — same as Contact */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-4 shrink-0 flex items-center justify-center text-primary" aria-hidden>
          <ArrowRightIcon />
        </span>
        <h2 id="about-heading" className="text-base font-bold text-primary font-mono">
          {content.about.heading}
        </h2>
      </div>

      {/* Left ~35% file icons, right ~65%: bio + Core Expertise */}
      <div className="grid grid-cols-1 md:grid-cols-[35fr_65fr] gap-8 md:gap-12">
        {/* Desktop: file icons horizontal, left-aligned */}
        <div className="hidden md:flex items-start gap-4 pl-6 pt-4 min-w-0">
          <FileIcon
            onClick={() => setIsImageEditorOpen(true)}
            label="profile.jpg"
            variant="image"
          />
          <FileIcon
            onClick={() => setIsVideoEditorOpen(true)}
            label="intro.mp4"
            variant="video"
          />
        </div>

        <div className="min-w-0 space-y-8">
          {/* Mobile: inline file icons above bio */}
          <div className="md:hidden pl-6 flex gap-4">
            <FileIcon
              onClick={() => setIsImageEditorOpen(true)}
              label="profile.jpg"
              variant="image"
            />
            <FileIcon
              onClick={() => setIsVideoEditorOpen(true)}
              label="intro.mp4"
              variant="video"
            />
          </div>

          <div className="space-y-4 pl-6">
            {content.about.bio.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-sm text-neutral-300 font-mono leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col w-full min-w-0 pl-6">
            <h3 className="text-sm font-mono text-secondary py-2 border-t border-secondary/10 first:border-t-0 first:pt-0">
              Core Expertise
            </h3>
            {content.about.expertise.map((item, index) => (
              <p
                key={index}
                className="text-sm text-neutral-300 font-mono py-2 border-t border-secondary/10"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Image Editor Window */}
      <AnimatePresence>
        {isImageEditorOpen && (
          <ImageEditorWindow
            imageSrc="/caio-ogata-profile.webp"
            title="profile.jpg"
            onClose={() => setIsImageEditorOpen(false)}
            dragConstraints={sectionRef}
          />
        )}
      </AnimatePresence>

      {/* Video Editor Window */}
      <AnimatePresence>
        {isVideoEditorOpen && (
          <VideoEditorWindow
            videoSrc="/intro.mp4"
            title="intro.mp4"
            onClose={() => setIsVideoEditorOpen(false)}
            dragConstraints={sectionRef}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

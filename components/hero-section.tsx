'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, ChevronDown, Video, VideoOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const demoVideos = [
  {
    src: '/Videos/demo1.mp4',
    title: 'BiO2 Habitat Tool – Scenario Overview',
  },
  {
    src: '/Videos/demo2.mp4',
    title: 'BiO2 Habitat Tool – Hydrogel & Telemetry Tour',
  },
]

export function HeroSection() {
  const [open, setOpen] = useState(false)
  const [activeVideo, setActiveVideo] = useState(0)

  const handleOpenDemo = (index: number) => {
    setActiveVideo(index)
    setOpen(true)
  }

  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden pt-16'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background'>
        <div className="absolute inset-0 bg-[url('/space-stars-nebula-dark.jpg')] bg-cover bg-center opacity-30" />
        <div className='absolute left-1/4 top-1/4 h-2 w-2 animate-float rounded-full bg-primary/40 blur-sm' />
        <div className='absolute right-1/3 top-1/3 h-1 w-1 animate-float rounded-full bg-accent/40 blur-sm [animation-delay:1s]' />
        <div className='absolute bottom-1/3 left-1/3 h-3 w-3 animate-float rounded-full bg-primary/30 blur-sm [animation-delay:2s]' />
      </div>

      <div className='container relative z-10 mx-auto px-4 py-20'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm'>
            <span className='relative flex h-2 w-2'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75'></span>
              <span className='relative inline-flex h-2 w-2 rounded-full bg-primary'></span>
            </span>
            NASA Artemis - Moon to Mars Pathway
          </div>

          <h1 className='mb-6 font-orbitron text-5xl font-bold leading-tight tracking-tight text-balance md:text-7xl lg:text-8xl'>
            Design the Future of{' '}
            <span className='animate-glow bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent'>
              Living Beyond Earth
            </span>
          </h1>

          <p className='mb-10 text-lg text-muted-foreground text-balance md:text-xl lg:text-2xl'>
            Build modular habitats, simulate BiO2 hydrogel life support, and test mission viability for Moon, Mars, and transit expeditions in real time.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button
              size='lg'
              className='group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90'
              asChild
            >
              <Link href='/design'>
                <span className='relative z-10'>Start Designing</span>
                <div className='absolute inset-0 -z-0 animate-shimmer' />
              </Link>
            </Button>
            <div className='flex flex-wrap items-center justify-center gap-3'>
              {demoVideos.map((video, index) => (
                <Button
                  key={video.src}
                  size='lg'
                  variant='outline'
                  className='group border-primary/20 bg-primary/5 hover:bg-primary/10'
                  onClick={() => handleOpenDemo(index)}
                >
                  <Play className='mr-2 h-4 w-4 transition-transform group-hover:scale-110' />
                  Watch Demo {demoVideos.length > 1 ? index + 1 : ''}
                </Button>
              ))}
            </div>
          </div>

          <div className='mt-20 flex flex-col items-center gap-2'>
            <p className='text-xs uppercase tracking-wider text-muted-foreground'>Scroll to Explore</p>
            <ChevronDown className='h-5 w-5 animate-bounce text-primary' />
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent' />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='border-primary/40 bg-[#0a0f1c]/95 text-foreground shadow-2xl shadow-primary/10 sm:max-w-4xl'>
          <DialogHeader>
            <DialogTitle className='font-orbitron'>{demoVideos[activeVideo]?.title ?? 'BiO2 Habitat Tool Demo'}</DialogTitle>
            <DialogDescription>Explore the habitat design workflow and BiO2 simulation capabilities.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='relative overflow-hidden rounded-xl border border-primary/20 bg-black/40 pt-[56.25%]'>
              <video
                key={demoVideos[activeVideo]?.src ?? 'demo-default'}
                className='absolute inset-0 h-full w-full rounded-lg'
                src={demoVideos[activeVideo]?.src ?? '/Video/demo1.mp4'}
                controls
                preload='metadata'
              />
            </div>
            {demoVideos.length > 1 && (
              <div className='flex gap-3'>
                {demoVideos.map((video, index) => (
                  <button
                    key={video.src}
                    type='button'
                    onClick={() => setActiveVideo(index)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      activeVideo === index
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border/60 bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    Demo {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

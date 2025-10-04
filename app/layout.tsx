import type React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { Suspense } from 'react'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BiO2 Habitat Design Tool | Design the Future of Living Beyond Earth',
  description:
    'Interactive space habitat design tool for Moon, Mars, and transit missions. Design with BiO2 hydrogel modules, simulate oxygen systems, and test mission viability.',
  generator: 'Codex',
} as const

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark'>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${orbitron.variable} antialiased`}>
        <Header />
        <Suspense fallback={<div className='p-8 text-center text-sm text-muted-foreground'>Loading BiO2 Habitat systems...</div>}>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}

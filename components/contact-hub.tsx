'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

export function ContactHub() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success('Transmission queued for Mission Control. We will respond within 48 hours.')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-5xl space-y-10'>
          <header className='text-center'>
            <h1 className='font-orbitron text-4xl font-bold'>Contact Mission Control</h1>
            <p className='mt-4 text-lg text-muted-foreground'>
              Questions about the BiO2 Habitat Design Tool, research collaborations, or educator access? Reach out to the team.
            </p>
          </header>

          <section className='grid gap-6 md:grid-cols-[3fr_2fr]'>
            <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
              <form className='space-y-5' onSubmit={handleSubmit}>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Name</label>
                    <Input value={name} onChange={(event) => setName(event.target.value)} required placeholder='Ada Lovelace' />
                  </div>
                  <div>
                    <label className='mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Email</label>
                    <Input
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      placeholder='astro@missioncontrol.space'
                    />
                  </div>
                </div>
                <div>
                  <label className='mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Message</label>
                  <Textarea
                    rows={6}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    placeholder='Share your mission goals, research questions, or classroom needs.'
                  />
                </div>
                <Button type='submit' className='flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90'>
                  <Send className='h-4 w-4' />
                  Send Transmission
                </Button>
              </form>
            </Card>

            <div className='space-y-6'>
              <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
                <h2 className='mb-4 font-orbitron text-lg font-semibold'>Mission Control</h2>
                <div className='space-y-3 text-sm text-muted-foreground'>
                  <p className='flex items-center gap-3 text-foreground'>
                    <Mail className='h-4 w-4 text-primary' />
                    phanthihiennhi.17@gmail.com
                  </p>
                </div>
              </Card>

            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

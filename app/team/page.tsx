import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const teamMembers = [
  {
    name: 'Phan Thi Hien Nhi, Msc',
    role: 'Principal Investigation',
    specialty: 'Habitat design and Mission Ops',
    image: '/phanthihiennhi.jpg',
  },
  {
    name: 'Nguyen Dinh Phong, Bsc',
    role: 'Research and mechanical engineer',
    specialty: 'Simulation and analysis Science',
    image: '/nguyendinhphong.jpg',
  }
]

export default function TeamPage() {
  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='mb-6 font-orbitron text-4xl font-bold'>Our Team</h1>
          <p className='mb-12 text-lg text-muted-foreground'>
            Meet the scientists, engineers, and mission leads guiding the BiO2 Habitat Design Tool.
          </p>

          <div className='grid gap-6 md:grid-cols-2'>
            {teamMembers.map((member) => (
              <Card key={member.name} className='overflow-hidden border-border/50 bg-card/50'>
                <div className='aspect-square overflow-hidden bg-secondary/30'>
                  <img src={member.image || '/placeholder.svg'} alt={member.name} className='h-full w-full object-cover' />
                </div>
                <div className='p-6'>
                  <h3 className='mb-1 font-orbitron text-xl font-semibold'>{member.name}</h3>
                  <Badge variant='outline' className='mb-3 border-primary/50 text-primary'>
                    {member.role}
                  </Badge>
                  <p className='text-sm text-muted-foreground'>{member.specialty}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

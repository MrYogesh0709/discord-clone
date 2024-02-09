import { redirect } from 'next/navigation'

import db from '@/lib/db'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import NavigationAction from '@/components/navigation/NavigationAction'
import NavigationItem from '@/components/navigation/NavigationItem'
import { ModeToggle } from '@/components/mode-toggle'

import { currentProfile } from '@/lib/current-profile'
import { UserButton } from '@clerk/nextjs'

const NavigationSidebar = async () => {
  const profile = await currentProfile()
  if (!profile) {
    return redirect('/')
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: { profileId: profile.id },
      },
    },
  })
  return (
    <div className="flex h-full w-full flex-col items-center space-y-4 bg-[#e3e5e8]  py-3 text-primary dark:bg-[#1e1f22]">
      <NavigationAction />
      <Separator className="mx-auto h-[2px] w-10 rounded-md  bg-zinc-300 dark:bg-zinc-700" />
      <ScrollArea className="w-full flex-1">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto  flex flex-col items-center  gap-y-4 p-3">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: 'h-[48px] w-[48px]',
            },
          }}
        />
      </div>
    </div>
  )
}

export default NavigationSidebar

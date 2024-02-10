import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import ServerSidebar from '@/components/server/ServerSidebar'
import NavigationSidebar from '@/components/navigation/NavigationSidebar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MobileToggleProps {
  serverId: string
}

const MobileToggle = ({ serverId }: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  )
}

export default MobileToggle

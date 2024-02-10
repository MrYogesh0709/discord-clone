import MobileToggle from '@/components/mobile-toggle'

import { Hash } from 'lucide-react'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  image?: string
}
const ChatHeader = ({ serverId, name, type, image }: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:to-zinc-400" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
    </div>
  )
}

export default ChatHeader

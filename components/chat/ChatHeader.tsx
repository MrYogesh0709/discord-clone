import MobileToggle from '@/components/mobile-toggle'

import { Hash } from 'lucide-react'
import UserAvatar from '../UserAvatar'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  image?: string
  username?: string
}
const ChatHeader = ({
  serverId,
  name,
  type,
  image,
  username,
}: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:to-zinc-400" />
      )}
      {type === 'conversation' && (
        <UserAvatar
          src={image}
          name={name}
          className="mr-2 h-8 w-8 md:h-8 md:w-8"
        />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
      {type === 'conversation' && (
        <span className="mx-2 text-sm font-thin text-zinc-900 dark:text-zinc-300">
          ({username})
        </span>
      )}
    </div>
  )
}

export default ChatHeader

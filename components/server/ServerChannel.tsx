'use client'

import { useParams, useRouter } from 'next/navigation'
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'

import { cn } from '@/lib/utils'
import { useModal } from '@/hooks/use-modal-store'
import { ActionTooltip } from '@/components/ActionTooltip'

import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
interface ServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}
const channelIconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal()
  const params = useParams()
  const Icon = channelIconMap[channel.type]
  return (
    <button
      className={cn(
        'group mb-1 flex w-full items-center rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.channelId === channel.id &&
          'bg-zinc-700/30 dark:bg-zinc-700/90 dark:text-zinc-700 '
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0 text-zinc-500 hover:text-zinc-500/30" />
      <p
        className={cn(
          'ml-2 line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
              onClick={() => onOpen('editChannel', { server, channel })}
              className="hidden h-4 w-4 text-green-500 transition hover:text-green-600 group-hover:block dark:text-green-400 dark:hover:text-green-300"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen('deleteChannel', { server, channel })}
              className="hidden h-4 w-4 text-rose-500 transition hover:text-rose-600 group-hover:block dark:text-rose-400 dark:hover:text-rose-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto h-4 w-4 text-zinc-500 transition hover:text-zinc-600  dark:text-zinc-400 dark:hover:text-zinc-300" />
      )}
    </button>
  )
}

export default ServerChannel

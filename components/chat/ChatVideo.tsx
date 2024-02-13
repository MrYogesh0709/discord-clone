'use client'

import qs from 'query-string'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ActionTooltip } from '@/components/ActionTooltip'
import { Video, VideoOff } from 'lucide-react'

const ChatVideo = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isVideo = searchParams?.get('video')
  const Icon = isVideo ? VideoOff : Video

  const tooltipLabel = isVideo ? 'End video call' : 'Start video call'

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || '',
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    )
    router.push(url)
  }

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="mr-4 transition hover:opacity-75">
        <Icon className="h-6 w-6 text-zinc-400 dark:text-zinc-500 " />
      </button>
    </ActionTooltip>
  )
}

export default ChatVideo

'use client'

import { useSocket } from './providers/socket-provider'
import { Badge } from './ui/badge'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="border-none bg-yellow-600 text-xs text-white"
      >
        fallback:Polling every 1s
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="border-none bg-emerald-600 text-xs text-white"
    >
      Live:Real-time
    </Badge>
  )
}

import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'

import db from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import ChatInput from '@/components/chat/ChatInput'
import ChatHeader from '@/components/chat/ChatHeader'
interface ChannelIdPage {
  params: { serverId: string; channelId: string }
}
const ChannelIdPage = async ({
  params: { serverId, channelId },
}: ChannelIdPage) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) {
    redirect('/')
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />
      <div className="flex-1">Future Messages</div>
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  )
}

export default ChannelIdPage

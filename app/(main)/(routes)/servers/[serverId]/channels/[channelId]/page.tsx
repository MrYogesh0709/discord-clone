import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'

import db from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

import ChatInput from '@/components/chat/ChatInput'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessages from '@/components/chat/ChatMessages'
import MediaRoom from '@/components/media-room'
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
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={false} />
      )}
      {channel.type === ChannelType.TEXT && (
        <>
          {' '}
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
    </div>
  )
}

export default ChannelIdPage

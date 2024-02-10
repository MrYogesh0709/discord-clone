import ChatHeader from '@/components/chat/ChatHeader'
import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

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
    </div>
  )
}

export default ChannelIdPage

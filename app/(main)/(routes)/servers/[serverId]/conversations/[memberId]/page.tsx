import { redirect } from 'next/navigation'
import { redirectToSignIn } from '@clerk/nextjs'

import db from '@/lib/db'
import getOrCreateConversation from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'

import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import MediaRoom from '@/components/media-room'

interface MemberPageProps {
  params: {
    memberId: string
    serverId: string
  }
  searchParams: {
    video?: boolean
  }
}
const MemberPage = async ({
  params: { memberId, serverId },
  searchParams: { video },
}: MemberPageProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirectToSignIn()
  }
  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) {
    return redirect('/')
  }
  //?Info => currently login in user currentMember.id and what we click is memberId
  const conversation = await getOrCreateConversation(currentMember.id, memberId)

  if (!conversation) {
    return redirect(`/servers/${serverId}`)
  }
  const { memberOne, MemberTwo } = conversation

  //? =>this is opposite if i start conversation i need to know OtherMember
  const otherMember =
    memberOne.profile.id === profile.id ? MemberTwo : memberOne

  return (
    <div className="flex h-full  flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        image={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
        username={otherMember.profile.username}
      />
      {video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
            username={otherMember.profile.username}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  )
}

export default MemberPage

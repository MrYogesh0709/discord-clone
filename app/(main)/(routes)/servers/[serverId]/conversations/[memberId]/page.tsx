import ChatHeader from '@/components/chat/ChatHeader'
import getOrCreateConversation from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface MemberPageProps {
  params: {
    memberId: string
    serverId: string
  }
}
const MemberPage = async ({
  params: { memberId, serverId },
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
    </div>
  )
}

export default MemberPage

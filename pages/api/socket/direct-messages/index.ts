import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/type'

import { currentProfilePages } from '@/lib/current-profile-pages'
import db from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: 'method not allowed' })
  }
  try {
    const profile = await currentProfilePages(req)
    const { content, fileUrl } = req.body
    const { conversationId } = req.query

    if (!profile) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (!conversationId) {
      return res.status(400).json({ message: 'conversationId is missing' })
    }

    if (!content) {
      return res.status(400).json({ message: 'Content is missing' })
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            MemberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        MemberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!conversation)
      return res.status(404).json({ message: 'conversation not found' })

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.MemberTwo

    if (!member) return res.status(404).json({ message: 'Member not found' })

    const directMessage = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    const channelKey = `chat:${conversationId}:messages`

    res?.socket?.server?.io?.emit(channelKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log(['DIRECT_MESSAGES_POST'], error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}

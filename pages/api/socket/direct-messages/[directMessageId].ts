import { NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/type'
import { MemberRole } from '@prisma/client'

import db from '@/lib/db'
import { currentProfilePages } from '@/lib/current-profile-pages'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(404).json({ message: 'method not allowed' })
  }
  try {
    const profile = await currentProfilePages(req)
    const { content } = req.body
    const { directMessageId, conversationId } = req.query

    if (!profile) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (!conversationId) {
      return res.status(400).json({ message: 'ConversationId is missing' })
    }
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: { profileId: profile.id },
          },
          {
            MemberTwo: { profileId: profile.id },
          },
        ],
      },
      include: {
        memberOne: {
          include: { profile: true },
        },
        MemberTwo: {
          include: { profile: true },
        },
      },
    })
    if (!conversation)
      return res.status(404).json({ message: 'Conversation not found' })

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.MemberTwo

    if (!member) return res.status(404).json({ message: 'Member not found' })

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ message: 'Message not Found' })
    }
    const isMessageOwner = directMessage.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      res.status(401).json({ error: '' })
    }
    if (req.method === 'DELETE') {
      if (!isMessageOwner) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted',
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }
    if (req.method === 'PATCH') {
      if (!content) {
        return res.status(400).json({ message: 'content is missing' })
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      })
    }
    const updatedKey = `chat:${conversationId}:messages:update`

    res?.socket?.server?.io?.emit(updatedKey, directMessage)

    return res.status(200).json(directMessage)
  } catch (error) {
    console.log(['MESSAGES_ID'], error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}

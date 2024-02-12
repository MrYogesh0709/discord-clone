import { currentProfilePages } from '@/lib/current-profile-pages'
import db from '@/lib/db'
import { NextApiResponseServerIo } from '@/type'
import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

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
    const { serverId, channelId, messageId } = req.query

    if (!profile) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (!serverId) {
      return res.status(400).json({ message: 'ServerId is missing' })
    }
    if (!channelId) {
      return res.status(400).json({ message: 'channelId is missing' })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) return res.status(404).json({ message: 'Server not found' })

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    })
    if (!channel) return res.status(404).json({ message: 'Channel not found' })

    const member = server.members.find(
      (member) => member.profileId === profile.id
    )
    if (!member) return res.status(404).json({ message: 'Member not found' })

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })
    if (!message || message.deleted) {
      return res.status(404).json({ message: 'Message not Found' })
    }
    const isMessageOwner = message.memberId === member.id
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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
      message = await db.message.update({
        where: {
          id: messageId as string,
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
    const updatedKey = `chat:${channelId}:messages:update`

    res?.socket?.server?.io?.emit(updatedKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log(['MESSAGES_ID'], error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}

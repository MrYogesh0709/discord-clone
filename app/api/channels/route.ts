import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { MemberRole } from '@prisma/client'

import { currentProfile } from '@/lib/current-profile'
import db from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json()
    const profile = await currentProfile()
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 401 })
    }
    if (name === 'general') {
      return new NextResponse('Name can not be general', { status: 400 })
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('[CREATE_CHANNEL]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

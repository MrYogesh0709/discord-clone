import { Member, Profile, Server } from '@prisma/client'
import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

type ServerMemberWithProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

type MessageWithMemberProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

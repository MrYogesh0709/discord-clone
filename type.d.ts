import { Member, Profile, Server } from '@prisma/client'

type ServerMemberWithProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

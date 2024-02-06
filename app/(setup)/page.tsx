import db from '@/lib/db'
import initialProfile from '@/lib/inital-profile'
import { redirect } from 'next/navigation'

//?Info :=> This is Entry Point of Application
const SetUpPage = async () => {
  const profile = await initialProfile()
  const server = await db.server.findFirst({
    where: {
      members: {
        some: { profileId: profile.id },
      },
    },
  })
  if (server) redirect(`/servers/${server.id}`)

  return <div>Create server</div>
}

export default SetUpPage

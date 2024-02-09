'use client'
import { useEffect, useState } from 'react'

import { CreateServerModel } from '@/components/models/create-server-model'
import { InviteModel } from '@/components/models/invite-model'
import { EditServerModal } from '@/components/models/edit-server-model'
import { MembersModel } from '@/components/models/members-model'
import { CreateChannelModel } from '@/components/models/create-channel-model'
import { LeaveServerModel } from '@/components/models/leave-server-model'
import { DeleteServerModel } from '@/components/models/delete-server-model'
import { DeleteChannelModel } from '@/components/models/delete-channel-model'
import { EditChannelModel } from '@/components/models/edit-channel-model'

//! this is solve of hydration error model is having problem with server side render
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <CreateServerModel />
      <InviteModel />
      <EditServerModal />
      <MembersModel />
      <CreateChannelModel />
      <LeaveServerModel />
      <DeleteServerModel />
      <DeleteChannelModel />
      <EditChannelModel />
    </>
  )
}

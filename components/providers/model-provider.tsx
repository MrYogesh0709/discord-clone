'use client'
import { useEffect, useState } from 'react'

import { CreateServerModel } from '@/components/models/create-server-model'
import { InviteModel } from '@/components/models/invite-model'
import { EditServerModal } from '@/components/models/edit-server-model'
import { MembersModel } from '@/components/models/members-model'

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
    </>
  )
}

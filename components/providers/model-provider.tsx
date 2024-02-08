'use client'

import { CreateServerModel } from '@/components/models/create-server-model'
import { useEffect, useState } from 'react'

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
    </>
  )
}

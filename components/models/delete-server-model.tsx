'use client'

import axios from 'axios'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { useModal } from '@/hooks/use-modal-store'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import FormSubmitButton from '@/components/form-submitBtn'

export const DeleteServerModel = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModelOpen = isOpen && type === 'deleteServer'
  const { server } = data

  const leaveServer = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/servers/${server?.id}`)
      onClose()
      startTransition(() => {
        //todo? router.push("/") why?? remove??
        router.refresh()
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this ?{' '}
            <span className="font-semibold text-red-500">{server?.name} </span>
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <FormSubmitButton loading={isLoading} onClick={leaveServer}>
              Confirm
            </FormSubmitButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

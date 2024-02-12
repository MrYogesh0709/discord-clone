'use client'

import qs from 'query-string'
import axios from 'axios'
import { useState } from 'react'
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

export const DeleteMessageModel = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, onClose, type, data } = useModal()
  const { apiUrl, query } = data
  const router = useRouter()

  const isModelOpen = isOpen && type === 'deleteMessage'

  const deleteMessage = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })
      await axios.delete(url)
      router.refresh()
      onClose()
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this ? <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <FormSubmitButton loading={isLoading} onClick={deleteMessage}>
              Confirm
            </FormSubmitButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

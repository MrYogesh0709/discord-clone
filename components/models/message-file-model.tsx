'use client'

import qs from 'query-string'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useModal } from '@/hooks/use-modal-store'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  fileMessageModalSchema,
  fileMessageModalValues,
} from '@/lib/validation'
import FileUpload from '@/components/file-upload'
import FormSubmitButton from '@/components/form-submitBtn'

//?Info => This model is start of App with create server
export const MessageFileModel = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query },
  } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'messageFile'

  const form = useForm<fileMessageModalValues>({
    resolver: zodResolver(fileMessageModalSchema),
    defaultValues: {
      fileUrl: '',
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  async function onSubmit(values: fileMessageModalValues) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      })
      router.refresh()
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Add an Attachment
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a File as Message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <FormSubmitButton loading={isSubmitting}>Send</FormSubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

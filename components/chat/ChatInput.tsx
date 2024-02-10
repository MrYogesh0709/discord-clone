'use client'

import qs from 'query-string'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { ChatInputSchema, chatInputValues } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Plus, Smile } from 'lucide-react'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const form = useForm<chatInputValues>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: '',
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (values: chatInputValues) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      await axios.post(url, values)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center  rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isSubmitting}
                    className="bottom-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
                    {...field}
                  />
                  <div className="absolute right-8 top-7">
                    <Smile />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput

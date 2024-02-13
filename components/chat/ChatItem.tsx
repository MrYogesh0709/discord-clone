'use client'

import Image from 'next/image'
import qs from 'query-string'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Member, MemberRole, Profile } from '@prisma/client'

import { useModal } from '@/hooks/use-modal-store'
import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib/utils'
import { ChatInputSchema, chatInputValues } from '@/lib/validation'

import { Input } from '@/components/ui/input'
import UserAvatar from '@/components/UserAvatar'
import { ActionTooltip } from '@/components/ActionTooltip'
import { Button } from '@/components/ui/button'
import FormSubmitButton from '@/components/form-submitBtn'
import { FormControl, FormField, FormItem, Form } from '@/components/ui/form'

import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react'

interface ChatItemProps {
  id: string
  content: string
  member: Member & {
    profile: Profile
  }
  timeStamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, any>
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mx-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mx-2 h-4 w-4 text-rose-500" />,
}

const ChatItem = ({
  id,
  content,
  member,
  timeStamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketQuery,
  socketUrl,
}: ChatItemProps) => {
  const router = useRouter()
  const params = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const { onOpen } = useModal()

  const form = useForm<chatInputValues>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: content,
    },
  })

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form

  useEffect(() => {
    form.reset({
      content: content,
    })
  }, [content, form])

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, form])

  const fileType = fileUrl?.split('.').pop()

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isMOderator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMessage = !deleted && (isAdmin || isMOderator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPDF = fileType === 'pdf' && fileUrl
  const isImage = !isPDF && fileUrl

  const onSubmit = async (values: chatInputValues) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })
      await axios.patch(url, values)
      setIsEditing(false)
      form.reset()
    } catch (error) {
      console.log(error)
    }
  }

  const onMemberClick = () => {
    if (member.id === currentMember.id) return
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div
          onClick={onMemberClick}
          className="cursor-pointer transition hover:drop-shadow-md"
        >
          <UserAvatar
            src={member.profile.imageUrl}
            name={member.profile.name}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex w-full flex-col">
              <div className="flex items-center">
                <p
                  onClick={onMemberClick}
                  className="cursor-pointer text-sm font-semibold hover:underline"
                >
                  {member.profile.name}
                </p>
                <ActionTooltip label={member.role}>
                  <p>{roleIconMap[member.role]}</p>
                </ActionTooltip>
              </div>
              <p className="cursor-pointer text-sm font-semibold text-zinc-500 hover:underline dark:text-zinc-400">
                {member.profile.username}{' '}
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {timeStamp}
                </span>
              </p>
              {isImage && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
                >
                  <Image
                    src={fileUrl}
                    alt={content}
                    fill
                    className="object-cover"
                  />
                </a>
              )}
              {isPDF && (
                <div className="relative mt-2  flex items-center rounded-md bg-background/10 p-2">
                  <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
                  >
                    PDF File
                  </a>
                </div>
              )}
              {!fileUrl && !isEditing && (
                <p
                  className={cn(
                    'mt-1 text-sm text-zinc-600 dark:text-zinc-300',
                    deleted &&
                      'mt-1 text-sm italic text-zinc-500 dark:text-zinc-400'
                  )}
                >
                  {content}
                  {isUpdated && !deleted && (
                    <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      (edited)
                    </span>
                  )}
                </p>
              )}
              {!fileUrl && isEditing && (
                <Form {...form}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full items-center gap-x-2 pt-2"
                  >
                    <FormField
                      control={control}
                      name="content"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="relative w-full ">
                              <Input
                                disabled={isSubmitting}
                                className="bottom-0 border-none bg-zinc-200/90 p-2  text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                                placeholder="Edited Message"
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <FormSubmitButton loading={isSubmitting}>
                      Save
                    </FormSubmitButton>
                  </form>
                  <span className="mt-1 text-[10px] text-zinc-400">
                    Press escape to cancel,enter to save
                  </span>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem

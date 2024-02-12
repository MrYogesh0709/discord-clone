'use client'

import { Fragment } from 'react'
import { Member } from '@prisma/client'
import { format } from 'date-fns'
import { useChatQuery } from '@/hooks/use-chat-query'
import { MessageWithMemberProfile } from '@/type'

import ChatItem from './ChatItem'
import ChatWelcome from './ChatWelcome'
import { Loader2, ServerCrash } from 'lucide-react'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, any>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

const DATE_FORMAT = 'd MMM yyyy,HH:mm'

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue })

  if (status === 'pending') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="flex-zinc-500 my-4 h-7 w-7 animate-spin" />
        <p className="to-zinc-500 text-xs dark:text-zinc-400">
          Loading Messages...
        </p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="flex-zinc-500 my-4 h-7 w-7" />
        <p className="to-zinc-500 text-xs dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type="channel" name={name} />
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ChatMessages

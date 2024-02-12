'use client'

import { Member } from '@prisma/client'
import ChatWelcome from './ChatWelcome'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, any>
  paramKey: 'channelId' | 'ConversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}
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
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type="channel" name={name} />
    </div>
  )
}

export default ChatMessages

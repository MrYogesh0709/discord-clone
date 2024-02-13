import { Hash } from 'lucide-react'

const ChatWelcome = ({
  type,
  name,
  username,
}: {
  name: string
  type: 'channel' | 'conversation'
  username?: string
}) => {
  return (
    <div className="mb-4 space-y-2 px-4">
      {type === 'channel' && (
        <div className="flex h-[75px] w-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <div className="flex items-end gap-2">
        <p className="text-xl font-bold md:text-3xl">
          {type === 'channel' && 'Welcome to #'}
          {name}
        </p>
        {type === 'conversation' && (
          <span className="mx-2 text-sm font-thin text-zinc-900 dark:text-zinc-300">
            #{username}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === 'channel'
          ? `This is the start of the ${name} channel.`
          : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  )
}

export default ChatWelcome

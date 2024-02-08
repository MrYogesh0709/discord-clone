import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string
  name: string
  className?: string
}
const UserAvatar = ({ src, name, className }: UserAvatarProps) => {
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={src} />
      <AvatarFallback>{name.at(0)}</AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar

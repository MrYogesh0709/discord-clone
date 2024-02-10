import { ChannelType } from '@prisma/client'
import * as z from 'zod'

const requiredString = (message: string) => z.string().min(1, message)

export const initialModalSchema = z.object({
  name: requiredString('Server name is required').max(
    20,
    'Server Name can not be more than 20 Character'
  ),
  imageUrl: requiredString('Server image is required'),
})

export type initialModalValues = z.infer<typeof initialModalSchema>

export const createChannelSchema = z.object({
  name: requiredString('Channel name is required')
    .max(15, 'Channel Name can no be more than 15 Character')
    .refine((name) => name.toLowerCase() !== 'general', {
      message: `Channel name can not be 'general' in any case variation`,
    }),
  type: z.nativeEnum(ChannelType),
})

export type createChannelValues = z.infer<typeof createChannelSchema>

export const ChatInputSchema = z.object({
  content: z.string().min(1),
})

export type chatInputValues = z.infer<typeof ChatInputSchema>

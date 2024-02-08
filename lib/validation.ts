import { ChannelType } from '@prisma/client'
import * as z from 'zod'

const requiredString = (message: string) => z.string().min(1, message)

export const initialModalSchema = z.object({
  name: requiredString('Server name is required'),
  imageUrl: requiredString('Server image is required'),
})

export type initialModalValues = z.infer<typeof initialModalSchema>

export const createChannelSchema = z.object({
  name: requiredString('Channel name is required').refine(
    (name) => name !== 'general',
    {
      message: 'Channel name can not be "general"',
    }
  ),
  type: z.nativeEnum(ChannelType),
})

export type createChannelValues = z.infer<typeof createChannelSchema>

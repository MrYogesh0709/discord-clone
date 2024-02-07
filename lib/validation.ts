import * as z from 'zod'

const requiredString = (message: string) => z.string().min(1, message)

export const initialModalSchema = z.object({
  name: requiredString('Server name is required'),
  imageUrl: requiredString('Server image is required'),
})

export type initialModalValues = z.infer<typeof initialModalSchema>

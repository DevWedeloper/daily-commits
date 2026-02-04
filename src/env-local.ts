/* eslint-disable node/prefer-global/process */
import { z } from 'zod'

const envSchema = z.object({
  USER_TIMEZONE: z.string().min(1),
})

const env = envSchema.parse(process.env)

export default env

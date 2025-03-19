import { z } from 'zod';

const envSchema = z.object({
  GH_TOKEN: z.string().min(1),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_SENDER: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;

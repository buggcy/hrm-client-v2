import { z } from 'zod';

export const IApiKey = z.object({
  hashed_key: z.string(),
  user_id: z.number(),
  name: z.string(),
  whitelisted_ips: z.array(z.string()),
  key_prefix: z.string(),
  created_at: z.string().transform(str => new Date(str)),
  updated_at: z.string().transform(str => new Date(str)),
});

export type IApiKey = z.infer<typeof IApiKey>;

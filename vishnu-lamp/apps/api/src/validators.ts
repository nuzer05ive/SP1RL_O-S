import { z } from 'zod';

export const walEventSchema = z.object({
  id: z.string(),
  t: z.string(),
  type: z.string(),
  scene_id: z.string(),
  user_id: z.string(),
  req_id: z.string(),
  model_semver: z.string(),
  kernel_digest: z.string(),
  payload: z.record(z.any()),
  status: z.enum(['OK', 'FAILED'])
});

export type WalEventInput = z.infer<typeof walEventSchema>;

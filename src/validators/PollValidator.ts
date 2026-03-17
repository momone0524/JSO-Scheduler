import { z } from 'zod';

const CreatePollSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  closedAt: z.string(),
});

export type CreatePollInput = z.infer<typeof CreatePollSchema>;

export { CreatePollSchema };

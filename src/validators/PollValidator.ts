import { z } from 'zod';

const CreatePollSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(100).optional(),
  closeAt: z.string(),
  pollType: z.enum(['schedule', 'job']),
});

const UpdatePollSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  closeAt: z.string(),
});

export type CreatePollInput = z.infer<typeof CreatePollSchema>;
export type UpdatePollInput = z.infer<typeof UpdatePollSchema>;

export { CreatePollSchema, UpdatePollSchema };

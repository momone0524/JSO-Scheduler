import { z } from 'zod';

const CreatePollSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(100).optional(),
  closeAt: z.string(),
  pollType: z.enum(['schedule', 'job']),
});

const UpdatePollSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(100).optional(),
  closeAt: z.string().optional(),
  pollType: z.enum(['schedule', 'job']).optional(),
});

export type CreatePollInput = z.infer<typeof CreatePollSchema>;

export { CreatePollSchema, UpdatePollSchema };

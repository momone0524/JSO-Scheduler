import { z } from 'zod';

const CreatePollOptionSchema = z.object({
  joboption: z.string().min(1).max(100).optional(),
  scheduleoption: z.string().min(1).max(100).optional(),
});

export type CreatePollOptionInput = z.infer<typeof CreatePollOptionSchema>;

export { CreatePollOptionSchema };

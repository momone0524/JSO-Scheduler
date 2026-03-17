import { z } from 'zod';

const CreatePollOptionSchema = z.object({
  option: z.string().min(1).max(100),
});

export type CreatePollOptionInput = z.infer<typeof CreatePollOptionSchema>;

export { CreatePollOptionSchema };

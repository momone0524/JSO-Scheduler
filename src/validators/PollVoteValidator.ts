import { z } from 'zod';

const CreatePollVoteSchema = z.object({
  optionId: z.string().min(1).max(100),
});

export type CreatePollVoteInput = z.infer<typeof CreatePollVoteSchema>;

export { CreatePollVoteSchema };

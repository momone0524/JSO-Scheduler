import { z } from 'zod';

const CreatePollVoteSchema = z.object({
  optionId: z.string().min(1).max(100),
});

const UpdatePollVoteSchema = z.object({
  optionId: z.string().min(1).optional(),
});

export type CreatePollVoteInput = z.infer<typeof CreatePollVoteSchema>;
export type UpdatePollVoteInput = z.infer<typeof UpdatePollVoteSchema>;

export { CreatePollVoteSchema, UpdatePollVoteSchema };

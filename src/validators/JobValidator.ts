import { z } from 'zod';

const CreateJobSchema = z.object({
  eventId: z.string(),
  pollId: z.string(),
  pollOptionId: z.string(),
  description: z.string().max(500).optional(),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

export { CreateJobSchema };

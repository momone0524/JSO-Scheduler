import { z } from 'zod';

const CreateJobSchema = z.object({
  jobName: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  eventId: z.string(),
  pollId: z.string().optional(),
  pollOptionId: z.string().optional(),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

export { CreateJobSchema };

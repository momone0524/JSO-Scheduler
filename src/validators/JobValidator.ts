import { z } from 'zod';

const CreateJobSchema = z.object({
  jobName: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  eventId: z.string(),
  pollId: z.string().optional(),
  pollOptionId: z.string().optional(),
});

const UpdateJobSchema = z.object({
  jobName: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  eventId: z.string().min(1).optional(),
  pollId: z.string().optional(),
  pollOptionId: z.string().optional(),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;

export { CreateJobSchema, UpdateJobSchema };

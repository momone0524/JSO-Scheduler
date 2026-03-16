import { z } from 'zod';

const CreateJobSchema = z.object({
  jobType: z.enum(['Reception', 'Food', 'Activity1', 'Activity2', 'Activity3']),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500),
  leaderId: z.string(),
  setupStartTime: z.string(),
});

export { CreateJobSchema };

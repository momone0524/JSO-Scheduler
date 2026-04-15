import { z } from 'zod';

const CreateJobAssignmentSchema = z.object({
  jobId: z.string(),
  userId: z.string(),
});

export type CreateJobAssignmentInput = z.infer<typeof CreateJobAssignmentSchema>;

export { CreateJobAssignmentSchema };

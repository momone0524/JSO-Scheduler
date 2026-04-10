import { z } from 'zod';

const CreateJobAssignmentSchema = z.object({
  jobId: z.string(),
  userId: z.string(),
});

const UpdateJobAssignmentSchema = z.object({
  jobId: z.string(),
  userId: z.string(),
});

export type CreateJobAssignmentInput = z.infer<typeof CreateJobAssignmentSchema>;
export type UpdateJobAssignmentInput = z.infer<typeof UpdateJobAssignmentSchema>;

export { CreateJobAssignmentSchema, UpdateJobAssignmentSchema };

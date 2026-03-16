import { z } from 'zod';

const CreateAssignJobSchema = z.object({
  userId: z.string(),
  leaderId: z.string(),
});

export { CreateAssignJobSchema };

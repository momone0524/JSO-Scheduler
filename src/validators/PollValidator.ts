import { z } from 'zod';

const CreatePollSchema = z.object({
  title: z.string().min(1).max(100),
  discription: z.string().min(1).max(5),
  closedAt: z.string(),
});

export { CreatePollSchema };

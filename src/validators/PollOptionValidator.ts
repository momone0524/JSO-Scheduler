import { z } from 'zod';

const CreatePollOptionSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.number().min(1).max(100).optional(),
  OptionDateTime: z.string().optional(),
});

export { CreatePollOptionSchema };

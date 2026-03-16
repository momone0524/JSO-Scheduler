import { z } from 'zod';

const CreateEventSchema = z.object({
  eventName: z.string().min(1).max(100),
  place: z.string().min(1).max(100),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  pollId: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;

export { CreateEventSchema };

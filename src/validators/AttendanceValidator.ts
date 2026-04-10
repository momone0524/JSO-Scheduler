import { z } from 'zod';

const CreateAttendanceSchema = z.object({
  attend: z.enum(['Yes', 'No', 'Joining Midway']),
  attendTime: z.string().optional(),
});

const UpdateAttendanceSchema = z.object({
  attend: z.enum(['Yes', 'No', 'Joining Midway']),
  attendTime: z.string().optional(),
});

export type CreateAttendanceInput = z.infer<typeof CreateAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof UpdateAttendanceSchema>;

export { CreateAttendanceSchema, UpdateAttendanceSchema };

import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  gradeYear: z.number().min(1).max(5),
  major: z.string().min(1).max(100),
  birthday: z.string(),
  language: z.enum(['ja', 'en']),
  role: z.enum(['Board Member', 'Member']),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export { CreateUserSchema, LoginUserSchema };

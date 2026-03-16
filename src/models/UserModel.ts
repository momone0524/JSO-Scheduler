import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';
import { CreateUserInput } from '../validators/UserValidator.js';

const UserRepository = AppDataSource.getRepository(User);

async function getAllUsers(): Promise<User[]> {
  return UserRepository.find({
    select: {
      userId: true,
      name: true,
      gradeYear: true,
      major: true,
      birthday: true,
      language: true,
      role: true,
      email: true,
    },
  });
}

async function getUserById(userId: string): Promise<User | null> {
  return UserRepository.findOne({
    select: {
      userId: true,
      name: true,
      gradeYear: true,
      major: true,
      birthday: true,
      language: true,
      role: true,
      email: true,
    },
    where: { userId },
  });
}

async function getUserByEmail(email: string): Promise<User | null> {
  return UserRepository.findOne({ where: { email } });
}

async function addUser(data: CreateUserInput, passwordHash: string): Promise<User> {
  const newUser = new User();
  newUser.name = data.name;
  newUser.gradeYear = data.gradeYear;
  newUser.major = data.major;
  newUser.birthday = new Date(data.birthday);
  newUser.language = data.language;
  newUser.role = data.role;
  newUser.email = data.email;
  newUser.passwordHash = passwordHash;
  return UserRepository.save(newUser);
}

export { addUser, getAllUsers, getUserByEmail, getUserById };

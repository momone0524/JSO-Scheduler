import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';

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

async function addUser(
  name: string,
  gradeYear: number,
  major: string,
  birthday: string,
  language: 'ja' | 'en',
  role: 'Board Member' | 'Member',
  email: string,
  passwordHash: string,
): Promise<User> {
  const newUser = new User();
  newUser.name = name;
  newUser.gradeYear = gradeYear;
  newUser.major = major;
  newUser.birthday = new Date(birthday);
  newUser.language = language;
  newUser.role = role;
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  return UserRepository.save(newUser);
}

export { addUser, getAllUsers, getUserByEmail, getUserById };

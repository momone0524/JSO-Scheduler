import { AppDataSource } from '../dataSource.js';
import { User } from '../entities/User.js';
import { CreateUserInput, UpdateUserInput } from '../validators/UserValidator.js';

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

// ユーザー情報の更新
async function updateUserInfo(data: UpdateUserInput, userId: string): Promise<User | null> {
  const user = await UserRepository.findOne({ where: { userId } });

  if (!user) {
    return null;
  }

  user.name = data.name;
  user.gradeYear = data.gradeYear;
  user.major = data.major;
  user.birthday = new Date(data.birthday);
  user.language = data.language;
  user.role = data.role;
  user.email = data.email;
  return UserRepository.save(user);
}

export { addUser, getAllUsers, getUserByEmail, getUserById, updateUserInfo };

import argon2 from 'argon2';
import { Request, Response } from 'express';
import { addUser, getAllUsers, getUserByEmail, getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateUserInput, CreateUserSchema, LoginUserSchema } from '../validators/UserValidator.js';

async function registerUser(req: Request, res: Response): Promise<void> {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const data: CreateUserInput = result.data;

  try {
    const passwordHash = await argon2.hash(data.password);
    const newUser = await addUser(data, passwordHash);
    console.log(newUser);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const result = LoginUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
      res.sendStatus(403);
      return;
    }

    if (!(await argon2.verify(user.passwordHash, password))) {
      req.session.logInAttempts = (req.session.logInAttempts ?? 0) + 1;
      res.sendStatus(403);
      return;
    }

    await req.session.clearSession();
    req.session.authenticatedUser = { userId: user.userId, email: user.email };
    req.session.isLoggedIn = true;

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

async function logOut(req: Request, res: Response): Promise<void> {
  await req.session.clearSession();
  res.sendStatus(204);
}

async function getUserProfile(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // 自分のセッションからアクセスしていなければエラー
  if (req.session.authenticatedUser.userId !== req.params.userId) {
    res.sendStatus(403);
    return;
  }

  const user = await getUserById(req.params.userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user });
}

async function getUsers(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const users = await getAllUsers();
  res.json({ users });
}

export { getUserProfile, getUsers, logIn, logOut, registerUser };

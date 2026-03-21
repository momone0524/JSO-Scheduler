import { Request, Response } from 'express';
import { getPollById } from '../models/PollModel.js';
import {
  addPollJobOption,
  getAllPollOptions,
  getPollOptionById,
  getPollOptionInPollByName,
} from '../models/PollOptionModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import {
  CreatePollOptionInput,
  CreatePollOptionSchema,
} from '../validators/PollOptionValidator.js';

async function CreateNewPollJobOption(req: Request, res: Response): Promise<void> {
  const { userId, pollId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // ユーザーがなければエラー
  const user = await getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // 自分のセッションからアクセスしていなければエラー
  if (req.session.authenticatedUser.userId !== req.params.userId) {
    res.sendStatus(403);
    return;
  }

  // Pollがなければエラー
  const poll = await getPollById(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  if (poll.isClosed === true) {
    res.status(404).json({ error: 'Poll is already closed' });
    return;
  }

  if (poll.pollType === 'schedule') {
    res.status(404).json({ error: 'The Option should be JOB for Job Poll' });
    return;
  }

  // ボードメンバーでなければエラー
  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to create a PollOption' });
    return;
  }

  // 書き込み内容が違ったらエラー
  const result = CreatePollOptionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  // PollOptionが既に存在する場合はエラー
  const polloption = await getPollOptionInPollByName(pollId, result.data.joboption);
  if (polloption) {
    res.status(404).json({ error: 'PollOption already exists' });
    return;
  }

  const data: CreatePollOptionInput = result.data;

  try {
    const newPollOption = await addPollJobOption(data, poll);
    console.log(newPollOption);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function CreateNewPollScheduleOption(req: Request, res: Response): Promise<void> {
  const { userId, pollId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // ユーザーがなければエラー
  const user = await getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // 自分のセッションからアクセスしていなければエラー
  if (req.session.authenticatedUser.userId !== req.params.userId) {
    res.sendStatus(403);
    return;
  }

  // Pollがなければエラー
  const poll = await getPollById(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  if (poll.isClosed === true) {
    res.status(404).json({ error: 'Poll is already closed' });
    return;
  }

  if (poll.pollType === 'job') {
    res.status(404).json({ error: 'The Option should be DATE for Schedule Poll' });
    return;
  }

  // ボードメンバーでなければエラー
  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to create a PollOption' });
    return;
  }

  // 書き込み内容が違ったらエラー
  const result = CreatePollOptionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  // PollOptionが既に存在する場合はエラー
  const polloption = await getPollOptionInPollByName(pollId, result.data.scheduleoption);
  if (polloption) {
    res.status(404).json({ error: 'PollOption already exists' });
    return;
  }

  const data: CreatePollOptionInput = result.data;

  try {
    const newPollOption = await addPollJobOption(data, poll);
    console.log(newPollOption);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getPollOptionInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const pollOption = await getPollOptionById(req.params.optionId);

  if (!pollOption) {
    res.status(404).json({ error: 'PollOption not found' });
    return;
  }
  res.json({ pollOption });
}

async function getPollOptions(req: Request, res: Response): Promise<void> {
  const { pollId } = req.params;
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // Pollがなければエラー
  const poll = await getPollById(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  const pollOptions = await getAllPollOptions(pollId);

  if (!pollOptions) {
    res.status(404).json({ error: 'PollOption not found' });
    return;
  }
  res.json({ pollOptions });
}

export { CreateNewPollJobOption, CreateNewPollScheduleOption, getPollOptionInfo, getPollOptions };

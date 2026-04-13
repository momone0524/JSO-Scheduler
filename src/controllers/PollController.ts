import { Request, Response } from 'express';
import { getEventById } from '../models/EventModel.js';
import {
  addPoll,
  closedPollByTime,
  deletePoll,
  getAllPolls,
  getPollById,
  updatePoll,
} from '../models/PollModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import {
  CreatePollInput,
  CreatePollSchema,
  UpdatePollSchema,
} from '../validators/PollValidator.js';

async function CreateNewPoll(req: Request, res: Response): Promise<void> {
  const { userId, eventId } = req.params;

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
    res.sendStatus(403); // Authenticated but not authorized
    return;
  }

  // ボードメンバーでなければエラー
  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to create a Poll' });
    return;
  }

  // Eventがなければエラー
  const event = await getEventById(eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  // 書き込み内容が違ったらエラー
  const result = CreatePollSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const data: CreatePollInput = result.data;

  try {
    const newPoll = await addPoll(data, user, event);
    console.log(newPoll);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getPollInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const poll = await getPollById(req.params.pollId);

  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }
  res.json({ poll });
}

async function getPolls(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const polls = await getAllPolls();
  res.json({ polls });
}

// Poll isClosed 情報更新
async function closedPollExpire(req: Request, res: Response): Promise<void> {
  const { pollId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  try {
    const closedPoll = await closedPollByTime(pollId);
    if (!closedPoll) {
      res.status(404).json({ error: 'Poll not found' });
      return;
    }
    res.json({ closedPoll });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function updatePollInfo(req: Request, res: Response): Promise<void> {
  const { pollId, userId } = req.params;

  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const poll = await getPollById(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (req.session.authenticatedUser.userId !== req.params.userId) {
    res.sendStatus(403);
    return;
  }

  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to update a Poll' });
    return;
  }

  const result = UpdatePollSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  try {
    const updatedPoll = await updatePoll(result.data, pollId);
    if (!updatedPoll) {
      res.status(404).json({ error: 'Poll not found' });
      return;
    }
    res.json({ poll: updatedPoll });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deletePollInfo(req: Request, res: Response): Promise<void> {
  const { pollId, userId } = req.params;

  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const poll = await getPollById(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.status(404).json({ errir: 'User not found' });
    return;
  }

  if (req.session.authenticatedUser.userId !== req.params.userId) {
    res.sendStatus(403);
    return;
  }

  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to delete a Poll' });
    return;
  }

  await deletePoll(pollId);
  res.sendStatus(204);
}

export { closedPollExpire, CreateNewPoll, deletePollInfo, getPollInfo, getPolls, updatePollInfo };

import { Request, Response } from 'express';
import { getPollById } from '../models/PollModel.js';
import { getPollOptionById } from '../models/PollOptionModel.js';
import {
  addPollVote,
  getAllPollVote,
  getAllPollVoteByOption,
  getPollVoteById,
} from '../models/PollVoteModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreatePollVoteInput, CreatePollVoteSchema } from '../validators/PollVoteValidator.js';

async function CreateNewPollVote(req: Request, res: Response): Promise<void> {
  const { userId, pollId, optionId } = req.params;

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

  // Poll Optionがなければエラー
  const pollOption = await getPollOptionById(optionId);
  if (!pollOption) {
    res.status(404).json({ error: 'Poll option not found' });
    return;
  }

  // 書き込み内容が違ったらエラー
  const result = CreatePollVoteSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const data: CreatePollVoteInput = result.data;

  try {
    const newPollVote = await addPollVote(data, poll, user, pollOption);
    console.log(newPollVote);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getPollVoteInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const pollVote = await getPollVoteById(req.params.voteId);

  if (!pollVote) {
    res.status(404).json({ error: 'PollVote not found' });
    return;
  }
  res.json({ pollVote });
}

async function getPollVotes(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const pollVotes = await getAllPollVote();
  res.json({ pollVotes });
}

async function getPollVoteInOption(req: Request, res: Response): Promise<void> {
  const { optionId } = req.params;
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // Optionがなければエラー
  const option = await getPollOptionById(optionId);
  if (!option) {
    res.status(404).json({ error: 'Option not found' });
    return;
  }
  const votes = await getAllPollVoteByOption(optionId);

  if (!votes) {
    res.status(404).json({ error: 'Votes not found' });
    return;
  }
  res.json({ votes });
}

export { CreateNewPollVote, getPollVoteInfo, getPollVoteInOption, getPollVotes };

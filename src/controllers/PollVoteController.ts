import { Request, Response } from 'express';
import { getAttendanceByEventAndUserId } from '../models/AttendanceModel.js';
import { getPollById } from '../models/PollModel.js';
import { getPollOptionById } from '../models/PollOptionModel.js';
import {
  addPollVote,
  deletePollVote,
  getAllPollVote,
  getAllPollVoteByOption,
  getPollVoteById,
  getPollVoteByPollAndUser,
} from '../models/PollVoteModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../types/utils/db-utils.js';

async function CreateNewPollVote(req: Request, res: Response): Promise<void> {
  const { pollId, optionId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // ユーザーがなければエラー
  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Pollがなければエラー
  const poll = await getPollById(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  // Pollがclosedならエラー
  if (poll.isClosed === true) {
    res.status(404).json({ error: 'Poll is already closed' });
    return;
  }

  // AttendanceがNoならばエラー
  const attendance = await getAttendanceByEventAndUserId(poll.event.eventId, user.userId);
  if (attendance.attend === 'No' && poll.pollType === 'job') {
    res.status(404).json({ error: 'You cannot participate this Poll' });
    return;
  }

  // すでに投票済みならばエラー
  const exist = await getPollVoteByPollAndUser(pollId, user.userId);
  if (exist) {
    res.status(400).json({ error: 'You already participated this Poll' });
    return;
  }

  // Poll Optionがなければエラー
  const pollOption = await getPollOptionById(optionId);
  if (!pollOption) {
    res.status(404).json({ error: 'Poll option not found' });
    return;
  }

  try {
    const newPollVote = await addPollVote(poll, user, pollOption);
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

async function deletePollVoteInfo(req: Request, res: Response): Promise<void> {
  const { voteId } = req.params;
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const pollVote = await getPollVoteById(voteId);
  if (!pollVote) {
    res.status(404).json({ error: 'PollVote not found' });
    return;
  }

  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const poll = await getPollById(pollVote.poll.pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  if (poll.isClosed === true) {
    res.status(404).json({ error: 'Poll is already closed' });
    return;
  }

  await deletePollVote(voteId);
  res.sendStatus(204);
}

export {
  CreateNewPollVote,
  deletePollVoteInfo,
  getPollVoteInfo,
  getPollVoteInOption,
  getPollVotes,
};

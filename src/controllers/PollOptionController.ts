import { Request, Response } from 'express';
import { getPollById } from '../models/PollModel.js';
import {
  addPollJobOption,
  addPollScheduleOption,
  deletePollOption,
  getAllPollOptions,
  getPollOptionById,
  isWinnerSet,
  updatePollJobOption,
  updatePollScheduleOption,
} from '../models/PollOptionModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import {
  CreatePollOptionInput,
  CreatePollOptionSchema,
  UpdatePollOptionSchema,
} from '../validators/PollOptionValidator.js';
async function CreateNewPollOption(req: Request, res: Response): Promise<void> {
  const { pollId } = req.params;

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

  /* PollOptionが既に存在する場合はエラー
  const polloption = await getPollOptionInPollByName(pollId, result.data.joboption);
  if (polloption) {
    res.status(404).json({ error: 'PollOption already exists' });
    return;
  }*/

  const data: CreatePollOptionInput = result.data;

  try {
    if (poll.pollType === 'schedule') {
      const newPollScheduleOption = await addPollScheduleOption(data, poll);
      console.log(newPollScheduleOption);
      res.sendStatus(201);
    } else if (poll.pollType === 'job') {
      const newPollJobOption = await addPollJobOption(data, poll);
      console.log(newPollJobOption);
      res.sendStatus(201);
    }
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

async function updatePollOptionInfo(req: Request, res: Response): Promise<void> {
  const { optionId } = req.params;
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const pollOption = await getPollOptionById(optionId);
  if (!pollOption) {
    res.status(404).json({ error: 'PollOption not found' });
    return;
  }

  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const poll = await getPollById(pollOption.poll.pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  if (poll.isClosed === true) {
    res.status(404).json({ error: 'Poll is already closed' });
    return;
  }

  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to update a PollOption' });
    return;
  }

  const result = UpdatePollOptionSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  try {
    if (poll.pollType === 'schedule') {
      const updatedPollScheduleOption = await updatePollScheduleOption(result.data, optionId);
      res.status(200).json({ pollOption: updatedPollScheduleOption });
      return;
    } else if (poll.pollType === 'job') {
      const updatedPollJobOption = await updatePollJobOption(result.data, optionId);
      res.status(200).json({ pollOption: updatedPollJobOption });
      return;
    }
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deletePollOptionInfo(req: Request, res: Response): Promise<void> {
  const { optionId } = req.params;
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const pollOption = await getPollOptionById(optionId);
  if (!pollOption) {
    res.status(404).json({ error: 'PollOption not found' });
    return;
  }

  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ erro: 'PollOption not found' });
    return;
  }

  const poll = await getPollById(pollOption.poll.pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  if (poll.isClosed == true) {
    res.status(404).json({ error: 'Poll is already closed' });
    return;
  }

  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to delete a PollOption' });
    return;
  }

  await deletePollOption(optionId);
  res.sendStatus(204);
}

async function settingWinner(req: Request, res: Response): Promise<void> {
  const { pollId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // ボードメンバーでなければエラー
  if (req.session.authenticatedUser.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to set a winner' });
    return;
  }

  // Pollがなければエラー
  const poll = await getPollById(pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  // Pollがclosedしてないならエラー
  if (poll.isClosed === false) {
    res.status(404).json({ error: 'Poll is not closed yet' });
    return;
  }

  try {
    const winnerSet = await isWinnerSet(pollId);
    if (winnerSet.length === 0) {
      res.status(404).json({ error: 'Poll not found' });
      return;
    }
    res.json({ winnerSet });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export {
  CreateNewPollOption,
  deletePollOptionInfo,
  getPollOptionInfo,
  getPollOptions,
  settingWinner,
  updatePollOptionInfo,
};

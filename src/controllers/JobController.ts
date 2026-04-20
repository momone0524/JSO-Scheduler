import { Request, Response } from 'express';
import { getEventById } from '../models/EventModel.js';
import {
  addJobAuto,
  addJobManually,
  deleteJob,
  getAllJobByEvent,
  getJobById,
  updateJob,
} from '../models/JobModel.js';
import { getPollById } from '../models/PollModel.js';
import { getAllPollOptions } from '../models/PollOptionModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../types/utils/db-utils.js';
import { CreateJobInput, CreateJobSchema, UpdateJobSchema } from '../validators/JobValidator.js';

async function CreateNewJobManual(req: Request, res: Response): Promise<void> {
  const { eventId } = req.params;

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

  // Eventがなければエラー
  const event = await getEventById(eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  // 書き込み内容が違ったらエラー
  const result = CreateJobSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const data: CreateJobInput = result.data;

  try {
    const newJob = await addJobManually(data, event);
    console.log(newJob);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

// 自動生成！！！！
async function CreateNewJobAuto(req: Request, res: Response): Promise<void> {
  const { eventId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // Eventがなければエラー
  const event = await getEventById(eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  const jobpoll = event.poll.find((p) => p.pollType == 'job');

  // Pollがなければエラー
  const poll = await getPollById(jobpoll.pollId);
  if (!poll) {
    res.status(404).json({ error: 'Poll not found' });
    return;
  }

  // Pollの種類が"job"でなければエラー
  const polltype = await getPollById(jobpoll.pollId);
  if (polltype.pollType === 'schedule') {
    res.status(40).json({ error: 'You cannot create Job from Schedule Poll' });
    return;
  }

  // PollOPtionがなければエラー
  const polloption = await getAllPollOptions(jobpoll.pollId);
  if (polloption.length === 0) {
    res.status(404).json({ error: 'PollOption not found' });
    return;
  }

  try {
    const job = [];
    for (const option of polloption) {
      const newJob = await addJobAuto(option, event);
      job.push(newJob);
      console.log(newJob);
    }
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getJobInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  // Jobがなければエラー
  const job = await getJobById(req.params.jobId);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }
  res.json({ job });
}

async function getJobInEvent(req: Request, res: Response): Promise<void> {
  const { eventId } = req.params;
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const jobs = await getAllJobByEvent(eventId);

  // Eventがなければエラー
  const event = await getEventById(eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json({ jobs });
}

async function updateJobInfo(req: Request, res: Response): Promise<void> {
  const { jobId } = req.params;
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  // Jobがなければエラー
  const job = await getJobById(jobId);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }
  // ユーザーがなければエラー
  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  // ボードメンバーでなければエラー
  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to update a Job' });
    return;
  }
  // データが正しい形式でなければエラー
  const result = UpdateJobSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  try {
    const updatedJob = await updateJob(result.data, jobId);
    if (!updatedJob) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ job: updatedJob });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deleteJobInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  const { jobId } = req.params;
  if (!req.session.isLoggedIn) {
    res.status(401);
    return;
  }
  // Jobがなければエラー
  const job = await getJobById(jobId);
  if (!job) {
    res.status(404).json({ error: 'Job not fourd' });
    return;
  }
  // ユーザーがなければエラー
  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  // ボードメンバーでなければエラー
  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission t o delete Job' });
    return;
  }

  await deleteJob(jobId);
  res.sendStatus(204);
}

export {
  CreateNewJobAuto,
  CreateNewJobManual,
  deleteJobInfo,
  getJobInEvent,
  getJobInfo,
  updateJobInfo,
};

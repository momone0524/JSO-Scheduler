import { Request, Response } from 'express';
import { getEventById } from '../models/EventModel.js';
///// （仮）を変更する！！！！！
import { addJobManually, getAllJobByEvent, getJobById } from '../models/JobModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateJobInput, CreateJobSchema } from '../validators/JobValidator.js';

async function CreateNewJobManual(req: Request, res: Response): Promise<void> {
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
    res.sendStatus(403);
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

async function getJobInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

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

export { CreateNewJobManual, getJobInEvent, getJobInfo };

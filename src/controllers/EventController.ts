import { Request, Response } from 'express';
import {
  addEventManual,
  deleteEventById,
  getAllEvents,
  getEventById,
  updateEventInfo,
} from '../models/EventModel.js';
import { getPollById, updateEventFromPoll } from '../models/PollModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import {
  CreateEventInput,
  CreateEventSchema,
  UpdateEventSchema,
} from '../validators/EventValidator.js';

async function CreateNewEventManual(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

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
    res.status(403).json({ error: 'You do not have permission to create an Event' });
    return;
  }

  // 書き込み内容が違ったらエラー
  const result = CreateEventSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const data: CreateEventInput = result.data;

  try {
    const newEvent = await addEventManual(data, user);
    console.log(newEvent);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getEventInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const event = await getEventById(req.params.eventId);

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.json({ event });
}

async function getEvents(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const events = await getAllEvents();
  res.json({ events });
}

// Event情報更新
async function updateEvent(req: Request, res: Response): Promise<void> {
  const { eventId, userId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // イベントがなければエラー
  const event = await getEventById(eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
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
    res.status(403).json({ error: 'You do not have permission to create an Event' });
    return;
  }

  const result = UpdateEventSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  try {
    const updatedEvent = await updateEventInfo(result.data, eventId);
    if (!updatedEvent) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ user: updatedEvent });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

// Event情報更新From Poll
async function updateEventFromPollAuto(req: Request, res: Response): Promise<void> {
  const { pollId, userId } = req.params;

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
    res.status(403).json({ error: 'You do not have permission to create an Event' });
    return;
  }

  try {
    const updated = await updateEventFromPoll(pollId);
    if (!updated) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ user: updated });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

// Eventの削除
async function deleteEvent(req: Request, res: Response): Promise<void> {
  const { eventId, userId } = req.params;

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
    res.status(403).json({ error: 'You do not have permission to create an Event' });
    return;
  }

  const event = await getEventById(eventId);

  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  await deleteEventById(eventId);
  res.sendStatus(204); // 204 No Content — successful, nothing to return
}

export {
  CreateNewEventManual,
  deleteEvent,
  getEventInfo,
  getEvents,
  updateEvent,
  updateEventFromPollAuto,
};

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
import { parseDatabaseError } from '../types/utils/db-utils.js';
import {
  CreateEventInput,
  CreateEventSchema,
  UpdateEventSchema,
} from '../validators/EventValidator.js';

// イベント作成
async function CreateNewEventManual(req: Request, res: Response): Promise<void> {
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

// イベントを全部見る
async function getEventInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // イベントがなければエラー
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
  const { eventId } = req.params;

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
  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
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

  // ユーザーがなければエラー
  const user = await getUserById(req.session.authenticatedUser.userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
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

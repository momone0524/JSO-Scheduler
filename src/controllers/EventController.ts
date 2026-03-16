import { Request, Response } from 'express';
import { addEventManual, getAllEvents, getEventById } from '../models/EventModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import { CreateEventInput, CreateEventSchema } from '../validators/EventValidator.js';

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
  const events = await getAllEvents();
  res.json({ events });
}

export { CreateNewEventManual, getEventInfo, getEvents };

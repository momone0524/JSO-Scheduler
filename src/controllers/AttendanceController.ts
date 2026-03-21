import { Request, Response } from 'express';
import {
  addAttendance,
  getAllAttendances,
  getAttendanceByEventAndUserId,
  getAttendanceById,
  updateAttendanceInfo,
} from '../models/AttendanceModel.js';
import { getEventById } from '../models/EventModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';
import {
  CreateAttendanceInput,
  CreateAttendanceSchema,
} from '../validators/AttendanceValidator.js';

async function CreateNewAttendance(req: Request, res: Response): Promise<void> {
  const { userId, eventId } = req.params;

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

  // 書き込み内容が違ったらエラー
  const result = CreateAttendanceSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  const data: CreateAttendanceInput = result.data;

  try {
    const newAttendance = await addAttendance(data, user, event);
    console.log(newAttendance);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getAttendanceOfUserInEvent(req: Request, res: Response): Promise<void> {
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

  // イベントがなければエラー
  const event = await getEventById(eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  const attendances = await getAttendanceByEventAndUserId(eventId, userId);

  if (!attendances) {
    res.status(404).json({ error: 'Attendance not found' });
    return;
  }
  res.json({ attendances });
}

async function getAttendanceInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const attendance = await getAttendanceById(req.params.attendanceId);

  if (!attendance) {
    res.status(404).json({ error: 'Attendance not found' });
    return;
  }
  res.json({ attendance });
}

async function getAttendances(req: Request, res: Response): Promise<void> {
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
  const attendances = await getAllAttendances(eventId);

  if (!attendances) {
    res.status(404).json({ error: 'Attendance not found' });
    return;
  }
  res.json({ attendances });
}

// Attendance 情報更新
async function updateAttendance(req: Request, res: Response): Promise<void> {
  const { attendanceId, userId } = req.params;

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

  const result = CreateAttendanceSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }

  try {
    const updatedAttendance = await updateAttendanceInfo(result.data, attendanceId);
    if (!updatedAttendance) {
      res.status(404).json({ error: 'Attendance not found' });
      return;
    }
    res.json({ user: updatedAttendance });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

export {
  CreateNewAttendance,
  getAttendanceInfo,
  getAttendanceOfUserInEvent,
  getAttendances,
  updateAttendance,
};

import { Request, Response } from 'express';
import {
  addAttendance,
  deleteAttendanceById,
  getAllAttendances,
  getAttendanceByEventAndUserId,
  getAttendanceById,
  updateAttendanceInfo,
} from '../models/AttendanceModel.js';
import { getEventById } from '../models/EventModel.js';
import { getUserById } from '../models/UserModel.js';
import { parseDatabaseError } from '../types/utils/db-utils.js';
import {
  CreateAttendanceInput,
  CreateAttendanceSchema,
} from '../validators/AttendanceValidator.js';

async function CreateNewAttendance(req: Request, res: Response): Promise<void> {
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

  // 書き込み内容が違ったらエラー
  const result = CreateAttendanceSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json(result.error.flatten());
    return;
  }

  // 既にAttendanceが存在している場合はエラー
  const attendance = await getAttendanceByEventAndUserId(eventId, user.userId);
  if (attendance) {
    res.status(404).json({ error: 'Attendance already exist' });
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

  // イベントがなければエラー
  const event = await getEventById(eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  const attendances = await getAttendanceByEventAndUserId(eventId, user.userId);

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
  const { attendanceId } = req.params;

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

// Attendanceの削除
async function deleteAttendance(req: Request, res: Response): Promise<void> {
  const { attendanceId } = req.params;

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

  const attendance = await getAttendanceById(attendanceId);

  if (!attendance) {
    res.status(404).json({ error: 'Attendance not found' });
    return;
  }

  await deleteAttendanceById(attendanceId);
  res.sendStatus(204); // 204 No Content — successful, nothing to return
}

export {
  CreateNewAttendance,
  deleteAttendance,
  getAttendanceInfo,
  getAttendanceOfUserInEvent,
  getAttendances,
  updateAttendance,
};

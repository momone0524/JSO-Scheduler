import { Request, Response } from 'express';
import { addAttendance, getAllAttendances, getAttendanceById } from '../models/AttendanceModel.js';
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

async function getAttendanceInfo(req: Request, res: Response): Promise<void> {
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
  const attendances = await getAllAttendances();
  res.json({ attendances });
}

export { CreateNewAttendance, getAttendanceInfo, getAttendances };

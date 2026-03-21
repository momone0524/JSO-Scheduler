import { AppDataSource } from '../dataSource.js';
import { Attendance } from '../entities/Attendance.js';
import { Event } from '../entities/Event.js';
import { User } from '../entities/User.js';
import { CreateAttendanceInput } from '../validators/AttendanceValidator.js';

const AttendanceRepository = AppDataSource.getRepository(Attendance);

async function getAllAttendances(eventId: string): Promise<Attendance[]> {
  return AttendanceRepository.find({
    where: { event: { eventId } },
    relations: ['user', 'event'],
    select: {
      attendanceId: true,
      attend: true,
      attendTime: true,
      user: {
        userId: true,
        name: true,
      },
      event: {
        eventId: true,
        eventName: true,
      },
    },
  });
}

async function getAttendanceByEventAndUserId(
  eventId: string,
  userId: string,
): Promise<Attendance | null> {
  return AttendanceRepository.findOne({
    where: { event: { eventId }, user: { userId } },
    relations: ['user', 'event'],
    select: {
      attendanceId: true,
      attend: true,
      attendTime: true,
      user: {
        userId: true,
        name: true,
      },
      event: {
        eventId: true,
        eventName: true,
      },
    },
  });
}

async function getAttendanceById(attendanceId: string): Promise<Attendance | null> {
  return AttendanceRepository.findOne({
    where: { attendanceId },
    relations: ['user', 'event'],
    select: {
      attendanceId: true,
      attend: true,
      attendTime: true,
      user: {
        userId: true,
        name: true,
      },
      event: {
        eventId: true,
        eventName: true,
      },
    },
  });
}

async function addAttendance(
  data: CreateAttendanceInput,
  user: User,
  event: Event,
): Promise<Attendance> {
  const newAttendance = new Attendance();
  newAttendance.attend = data.attend;
  newAttendance.attendTime = data.attendTime;
  newAttendance.event = event;
  newAttendance.user = user;
  return AttendanceRepository.save(newAttendance);
}

async function updateAttendanceInfo(
  data: CreateAttendanceInput,
  attendanceId: string,
): Promise<Attendance | null> {
  const attendance = await AttendanceRepository.findOne({
    where: { attendanceId },
    relations: ['user', 'event'],
    select: {
      attendanceId: true,
      attend: true,
      attendTime: true,
      user: {
        userId: true,
        name: true,
      },
      event: {
        eventId: true,
        eventName: true,
      },
    },
  });

  if (!attendance) {
    return null;
  }

  attendance.attend = data.attend;
  attendance.attendTime = data.attendTime;
  return AttendanceRepository.save(attendance);
}

export {
  addAttendance,
  getAllAttendances,
  getAttendanceByEventAndUserId,
  getAttendanceById,
  updateAttendanceInfo,
};

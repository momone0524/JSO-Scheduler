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
        gradeYear: true,
        major: true,
        birthday: true,
        language: true,
        role: true,
        email: true,
      },
      event: {
        eventId: true,
        eventName: true,
        place: true,
        date: true,
        startTime: true,
        endTime: true,
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
        gradeYear: true,
        major: true,
        birthday: true,
        language: true,
        role: true,
        email: true,
      },
      event: {
        eventId: true,
        eventName: true,
        place: true,
        date: true,
        startTime: true,
        endTime: true,
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

export { addAttendance, getAllAttendances, getAttendanceById };

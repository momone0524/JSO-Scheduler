import { AppDataSource } from '../dataSource.js';
import { Event } from '../entities/Event.js';
//import { Poll } from '../entities/Poll.js';
import { User } from '../entities/User.js';
import { CreateEventInput } from '../validators/EventValidator.js';

const EventRepository = AppDataSource.getRepository(Event);

async function getAllEvents(): Promise<Event[]> {
  return EventRepository.find({
    relations: ['user', 'poll'],
    select: {
      eventId: true,
      eventName: true,
      place: true,
      date: true,
      startTime: true,
      endTime: true,
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
      poll: {
        pollId: true,
      },
    },
  });
}

async function getEventById(eventId: string): Promise<Event | null> {
  return EventRepository.findOne({
    where: { eventId },
    relations: ['user', 'poll'],
    select: {
      eventId: true,
      eventName: true,
      place: true,
      date: true,
      startTime: true,
      endTime: true,
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
      poll: {
        pollId: true,
      },
    },
  });
}

async function addEventManual(data: CreateEventInput, user: User): Promise<Event> {
  const newEvent = new Event();
  newEvent.eventName = data.eventName;
  newEvent.place = data.place;
  newEvent.date = new Date(data.date);
  newEvent.startTime = data.startTime;
  newEvent.endTime = data.endTime;
  newEvent.user = user;
  return EventRepository.save(newEvent);
}

/* LATER
async function addEventFromPoll(user: User, poll: Poll): Promise<Event> {
  const newEvent = new Event();
  newEvent.eventName = poll.title;
  newEvent.place = 'TBD';
  newEvent.date = poll.closeAt;
  newEvent.startTime = '00:00';
  newEvent.endTime = '00:00';
  newEvent.user = user;
  newEvent.poll = poll;
  return EventRepository.save(newEvent);
}*/

export { addEventManual, getAllEvents, getEventById };

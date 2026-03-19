import { AppDataSource } from '../dataSource.js';
import { Event } from '../entities/Event.js';
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
      },
      poll: {
        pollId: true,
        title: true,
        pollType: true,
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
      },
      poll: {
        pollId: true,
        title: true,
        pollType: true,
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

export { addEventManual, getAllEvents, getEventById };

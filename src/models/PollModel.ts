import { AppDataSource } from '../dataSource.js';
import { Event } from '../entities/Event.js';
import { Poll } from '../entities/Poll.js';
import { User } from '../entities/User.js';
import { CreatePollInput } from '../validators/PollValidator.js';

const PollRepository = AppDataSource.getRepository(Poll);

async function getAllPolls(): Promise<Poll[]> {
  return PollRepository.find({
    relations: ['user', 'event'],
    select: {
      pollId: true,
      title: true,
      description: true,
      closeAt: true,
      isClosed: true,
      pollType: true,
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

async function getPollInEvent(eventId: string): Promise<Poll[]> {
  return PollRepository.find({
    where: { event: { eventId } },
    relations: ['user', 'event'],
    select: {
      pollId: true,
      title: true,
      description: true,
      closeAt: true,
      isClosed: true,
      pollType: true,
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

async function getPollById(pollId: string): Promise<Poll | null> {
  return PollRepository.findOne({
    where: { pollId },
    relations: ['user'],
    select: {
      pollId: true,
      title: true,
      description: true,
      closeAt: true,
      isClosed: true,
      pollType: true,
      user: {
        userId: true,
        name: true,
      },
    },
  });
}

async function addPoll(data: CreatePollInput, user: User, event: Event): Promise<Poll> {
  const newPoll = new Poll();
  newPoll.title = data.title;
  newPoll.description = data.description;
  newPoll.closeAt = new Date(data.closedAt);
  newPoll.pollType = data.pollType;
  newPoll.user = user;
  newPoll.event = event;
  return PollRepository.save(newPoll);
}

export { addPoll, getAllPolls, getPollById, getPollInEvent };

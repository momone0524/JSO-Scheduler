import { AppDataSource } from '../dataSource.js';
import { Event } from '../entities/Event.js';
import { Poll } from '../entities/Poll.js';
import { User } from '../entities/User.js';
import { CreatePollInput, UpdatePollInput } from '../validators/PollValidator.js';

const PollRepository = AppDataSource.getRepository(Poll);
const EventRepository = AppDataSource.getRepository(Event);

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

async function addPoll(data: CreatePollInput, user: User, event: Event): Promise<Poll> {
  const newPoll = new Poll();
  newPoll.title = data.title;
  newPoll.description = data.description;
  newPoll.closeAt = new Date(data.closeAt);
  newPoll.pollType = data.pollType;
  newPoll.user = user;
  newPoll.event = event;
  return PollRepository.save(newPoll);
}

async function updateEventFromPoll(pollId: string): Promise<Event | null> {
  const poll = await PollRepository.findOne({
    where: { pollId },
    relations: ['pollOptions', 'event'],
    select: {
      pollId: true,
      title: true,
      description: true,
      closeAt: true,
      isClosed: true,
      pollType: true,
      pollOptions: {
        optionId: true,
        joboption: true,
        scheduleoption: true,
        isWinner: true,
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

  if (!poll) {
    return null;
  }

  if (poll.pollType === 'job') {
    return null;
  }

  const winner = poll.pollOptions.find((win) => win.isWinner);

  if (!winner) {
    return null;
  }

  poll.event.date = winner.scheduleoption;
  return EventRepository.save(poll.event);
}

async function closedPollByTime(pollId: string): Promise<Poll | null> {
  const poll = await PollRepository.findOne({
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

  if (!poll) {
    return null;
  }

  const now = new Date();

  if (poll.closeAt <= now && !poll.isClosed) {
    poll.isClosed = true;
  }
  return PollRepository.save(poll);
}

async function UpdatePollSchema(data: UpdatePollInput, pollId: string): Promise<Poll | null> {
  const poll = await PollRepository.findOne({
    where: { pollId },
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

  if (!poll) {
    return null;
  }

  poll.title = data.title;
  poll.description = data.description;
  poll.closeAt = new Date(data.closeAt);
  poll.pollType = data.pollType;

  return PollRepository.save(poll);
}

export {
  addPoll,
  closedPollByTime,
  getAllPolls,
  getPollById,
  getPollInEvent,
  updateEventFromPoll,
  UpdatePollSchema,
};

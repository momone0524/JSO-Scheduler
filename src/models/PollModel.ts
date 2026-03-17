import { AppDataSource } from '../dataSource.js';
import { Poll } from '../entities/Poll.js';
import { User } from '../entities/User.js';
import { CreatePollInput } from '../validators/PollValidator.js';

const PollRepository = AppDataSource.getRepository(Poll);

async function getAllPolls(): Promise<Poll[]> {
  return PollRepository.find({
    relations: ['user'],
    select: {
      pollId: true,
      title: true,
      description: true,
      closeAt: true,
      isClosed: true,
      user: {
        userId: true,
        name: true,
        role: true,
        email: true,
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
      user: {
        userId: true,
        name: true,
        role: true,
        email: true,
      },
    },
  });
}

async function addPoll(data: CreatePollInput, user: User): Promise<Poll> {
  const newPoll = new Poll();
  newPoll.title = data.title;
  newPoll.description = data.description;
  newPoll.closeAt = new Date(data.closedAt);
  newPoll.user = user;
  return PollRepository.save(newPoll);
}

export { addPoll, getAllPolls, getPollById };

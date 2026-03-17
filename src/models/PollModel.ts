import { AppDataSource } from '../dataSource';
import { Poll } from '../entities/Poll.js';

const PollRepository = AppDataSource.getRepository(Poll);

async function getAllPolls(): Promise<Poll[]> {
  return PollRepository.find({
    select: {
      pollId: true,
      title: true,
      description: true,
      createdBy: true,
      closeAt: true,
      idClosed: true,
    },
  });
}

async function getPollById(pollId: string): Promise<Poll | null> {
  return PollRepository.findOne({
    select: {
      pollId: true,
      title: true,
      description: true,
      createdBy: true,
      closeAt: true,
      idClosed: true,
    },
    where: { pollId },
  });
}

async function addPoll(
  pollId: string,
  title: string,
  description: string,
  createdBy: string,
  closeAt: Date,
  idClosed: boolean,
): Promise<Poll> {
  const newPoll = new Poll();
  newPoll.pollId = pollId;
  newPoll.title = title;
  newPoll.description = description;
  newPoll.createdBy = createdBy;
  newPoll.closeAt = new Date(closeAt);
  newPoll.idClosed = idClosed;
  return PollRepository.save(newPoll);
}

export { addPoll, getAllPolls, getPollById };

import { AppDataSource } from '../dataSource.js';
import { Poll } from '../entities/Poll.js';
import { PollOption } from '../entities/PollOption.js';
import { PollVote } from '../entities/PollVote.js';
import { User } from '../entities/User.js';
import { CreatePollVoteInput } from '../validators/PollVoteValidator.js';

const PollVoteRepository = AppDataSource.getRepository(PollVote);

async function getAllPollVote(): Promise<PollVote[]> {
  return PollVoteRepository.find({
    relations: ['poll', 'user', 'polloption'],
    select: {
      voteId: true,
      poll: {
        pollId: true,
        title: true,
        description: true,
        closeAt: true,
        isClosed: true,
        pollType: true,
      },
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
      polloption: {
        optionId: true,
        option: true,
        isWinner: true,
      },
    },
  });
}

async function getPollVoteById(voteId: string): Promise<PollVote | null> {
  return PollVoteRepository.findOne({
    where: { voteId },
    relations: ['poll', 'user', 'polloption'],
    select: {
      voteId: true,
      poll: {
        pollId: true,
        title: true,
        description: true,
        closeAt: true,
        isClosed: true,
        pollType: true,
      },
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
      polloption: {
        optionId: true,
        option: true,
        isWinner: true,
      },
    },
  });
}

async function addPollVote(
  data: CreatePollVoteInput,
  poll: Poll,
  user: User,
  polloption: PollOption,
): Promise<PollVote> {
  const newPollVote = new PollVote();
  newPollVote.user = user;
  newPollVote.polloption = polloption;
  newPollVote.poll = poll;
  return PollVoteRepository.save(newPollVote);
}

export { addPollVote, getAllPollVote, getPollVoteById };

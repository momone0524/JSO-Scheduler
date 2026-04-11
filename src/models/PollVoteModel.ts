import { AppDataSource } from '../dataSource.js';
import { Poll } from '../entities/Poll.js';
import { PollOption } from '../entities/PollOption.js';
import { PollVote } from '../entities/PollVote.js';
import { User } from '../entities/User.js';

const PollVoteRepository = AppDataSource.getRepository(PollVote);

async function getAllPollVote(): Promise<PollVote[]> {
  return PollVoteRepository.find({
    relations: ['poll', 'user', 'polloption'],
    select: {
      voteId: true,
      poll: {
        pollId: true,
        title: true,
      },
      user: {
        userId: true,
        name: true,
      },
      polloption: {
        optionId: true,
        joboption: true,
        scheduleoption: true,
      },
    },
  });
}

async function getAllPollVoteByOption(optionId: string): Promise<PollVote[]> {
  return PollVoteRepository.find({
    where: { polloption: { optionId } },
    relations: ['poll', 'user', 'polloption'],
    select: {
      voteId: true,
      poll: {
        pollId: true,
        title: true,
      },
      user: {
        userId: true,
        name: true,
      },
      polloption: {
        optionId: true,
        joboption: true,
        scheduleoption: true,
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
      },
      user: {
        userId: true,
        name: true,
      },
      polloption: {
        optionId: true,
        joboption: true,
        scheduleoption: true,
      },
    },
  });
}

async function getPollVoteByPollAndUser(pollId: string, userId: string): Promise<PollVote | null> {
  return PollVoteRepository.findOne({
    where: { poll: { pollId }, user: { userId } },
    relations: ['poll', 'user', 'polloption'],
    select: {
      voteId: true,
      poll: {
        pollId: true,
        title: true,
      },
      user: {
        userId: true,
        name: true,
      },
      polloption: {
        optionId: true,
        joboption: true,
        scheduleoption: true,
      },
    },
  });
}

async function addPollVote(poll: Poll, user: User, polloption: PollOption): Promise<PollVote> {
  const newPollVote = new PollVote();
  newPollVote.user = user;
  newPollVote.polloption = polloption;
  newPollVote.poll = poll;
  return PollVoteRepository.save(newPollVote);
}

async function updatePollVote(voteId: string, polloption: PollOption): Promise<PollVote | null> {
  const pollVote = await PollVoteRepository.findOne({
    where: { voteId },
    relations: ['poll', 'user', 'polloption'],
    select: {
      voteId: true,
      poll: {
        pollId: true,
        title: true,
      },
      polloption: {
        optionId: true,
        joboption: true,
        scheduleoption: true,
      },
    },
  });

  if (!pollVote) {
    return null;
  }

  pollVote.polloption = polloption;

  return PollVoteRepository.save(pollVote);
}

async function deletePollVote(voteId: string): Promise<void> {
  const pollVote = await PollVoteRepository.findOne({ where: { voteId } });

  if (!pollVote) {
    return;
  }

  await PollVoteRepository.remove(pollVote);
}

export {
  addPollVote,
  deletePollVote,
  getAllPollVote,
  getAllPollVoteByOption,
  getPollVoteById,
  getPollVoteByPollAndUser,
  updatePollVote,
};

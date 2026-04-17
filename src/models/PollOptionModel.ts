import { AppDataSource } from '../dataSource.js';
import { Poll } from '../entities/Poll.js';
import { PollOption } from '../entities/PollOption.js';
import { CreatePollOptionInput, UpdatePollOptionInput } from '../validators/PollOptionValidator.js';

const PollOptionRepository = AppDataSource.getRepository(PollOption);

async function getAllPollOptions(pollId: string): Promise<PollOption[]> {
  return PollOptionRepository.find({
    where: { poll: { pollId } },
    relations: ['poll'],
    select: {
      optionId: true,
      joboption: true,
      scheduleoption: true,
      isWinner: true,
      poll: {
        pollId: true,
        title: true,
      },
    },
  });
}

async function getPollOptionById(optionId: string): Promise<PollOption | null> {
  return PollOptionRepository.findOne({
    where: { optionId },
    relations: ['poll'],
    select: {
      optionId: true,
      joboption: true,
      scheduleoption: true,
      isWinner: true,
      poll: {
        pollId: true,
        title: true,
      },
    },
  });
}

async function getPollOptionInPollByName(
  pollId: string,
  joboption: string,
): Promise<PollOption | null> {
  return PollOptionRepository.findOne({
    where: { poll: { pollId }, joboption },
    relations: ['poll'],
    select: {
      optionId: true,
      joboption: true,
      scheduleoption: true,
      isWinner: true,
      poll: {
        pollId: true,
        title: true,
      },
    },
  });
}

async function addPollJobOption(data: CreatePollOptionInput, poll: Poll): Promise<PollOption> {
  const newPollOption = new PollOption();
  newPollOption.joboption = data.joboption;
  newPollOption.poll = poll;
  return PollOptionRepository.save(newPollOption);
}

async function addPollScheduleOption(data: CreatePollOptionInput, poll: Poll): Promise<PollOption> {
  const newPollOption = new PollOption();
  newPollOption.scheduleoption = new Date(data.scheduleoption);
  newPollOption.poll = poll;
  return PollOptionRepository.save(newPollOption);
}

async function updatePollJobOption(
  data: UpdatePollOptionInput,
  optionId: string,
): Promise<PollOption | null> {
  const pollOption = await PollOptionRepository.findOne({
    where: { optionId },
    relations: ['poll'],
    select: {
      optionId: true,
      joboption: true,
      scheduleoption: true,
      poll: {
        pollId: true,
        title: true,
        pollType: true,
      },
    },
  });

  if (!pollOption) {
    return null;
  }

  pollOption.joboption = data.joboption;
  return PollOptionRepository.save(pollOption);
}

async function updatePollScheduleOption(
  data: UpdatePollOptionInput,
  optionId: string,
): Promise<PollOption | null> {
  const pollOption = await PollOptionRepository.findOne({
    where: { optionId },
    relations: ['poll'],
    select: {
      optionId: true,
      joboption: true,
      scheduleoption: true,
      poll: {
        pollId: true,
        title: true,
        pollType: true,
      },
    },
  });

  if (!pollOption) {
    return null;
  }

  pollOption.scheduleoption = new Date(data.scheduleoption);
  return PollOptionRepository.save(pollOption);
}

async function deletePollOption(optionId: string): Promise<void> {
  const pollOption = await PollOptionRepository.findOne({ where: { optionId } });

  if (!pollOption) {
    return;
  }
  await PollOptionRepository.remove(pollOption);
}

async function isWinnerSet(pollId: string): Promise<PollOption[]> {
  const pollOption = await PollOptionRepository.find({
    where: { poll: { pollId } },
    relations: ['pollvotes', 'poll'],
    select: {
      optionId: true,
      joboption: true,
      scheduleoption: true,
      isWinner: true,
      poll: {
        pollId: true,
        title: true,
      },
    },
  });

  // いったん全て false
  for (const option of pollOption) {
    option.isWinner = false;
  }

  let winner: PollOption | null = null;
  let maxVotes = -1;

  for (const option of pollOption) {
    const voteCount = option.pollvotes.length;

    if (voteCount > maxVotes) {
      maxVotes = voteCount;
      winner = option;
    }
  }

  if (winner) {
    winner.isWinner = true;
  }

  return PollOptionRepository.save(pollOption);
}

export {
  addPollJobOption,
  addPollScheduleOption,
  deletePollOption,
  getAllPollOptions,
  getPollOptionById,
  getPollOptionInPollByName,
  isWinnerSet,
  updatePollJobOption,
  updatePollScheduleOption,
};

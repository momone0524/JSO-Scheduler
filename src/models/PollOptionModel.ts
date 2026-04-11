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

async function updatePollOption(
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
      },
    },
  });

  if (!pollOption) {
    return null;
  }

  if (data.joboption !== undefined) {
    pollOption.joboption = data.joboption;
  }

  if (data.scheduleoption !== undefined) {
    pollOption.scheduleoption = new Date(data.scheduleoption);
  }

  return PollOptionRepository.save(pollOption);
}

async function deletePollOption(optionId: string): Promise<void> {
  const pollOption = await PollOptionRepository.findOne({ where: { optionId } });

  if (!pollOption) {
    return;
  }
  await PollOptionRepository.remove(pollOption);
}

export {
  addPollJobOption,
  addPollScheduleOption,
  deletePollOption,
  getAllPollOptions,
  getPollOptionById,
  getPollOptionInPollByName,
  updatePollOption,
};

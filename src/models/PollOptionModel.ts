import { AppDataSource } from '../dataSource.js';
import { Poll } from '../entities/Poll.js';
import { PollOption } from '../entities/PollOption.js';
import { CreatePollOptionInput } from '../validators/PollOptionValidator.js';

const PollOptionRepository = AppDataSource.getRepository(PollOption);

async function getAllPollOptions(pollId: string): Promise<PollOption[]> {
  return PollOptionRepository.find({
    where: { poll: { pollId } },
    relations: ['poll'],
    select: {
      optionId: true,
      option: true,
      isWinner: true,
      poll: {
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
      option: true,
      isWinner: true,
      poll: {
        title: true,
      },
    },
  });
}

async function addPollOption(data: CreatePollOptionInput, poll: Poll): Promise<PollOption> {
  const newPollOption = new PollOption();
  newPollOption.option = data.option;
  newPollOption.poll = poll;
  return PollOptionRepository.save(newPollOption);
}

export { addPollOption, getAllPollOptions, getPollOptionById };

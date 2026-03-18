import { AppDataSource } from '../dataSource.js';
import { Event } from '../entities/Event.js';
import { Job } from '../entities/Job.js';
import { CreateJobInput } from '../validators/JobValidator.js';

const JobRepository = AppDataSource.getRepository(Job);

async function getAllJobByEvent(eventId: string): Promise<Job[]> {
  return JobRepository.find({
    where: { event: { eventId } },
    relations: ['event', 'poll', 'polloption'],
    select: {
      jobId: true,
      description: true,
      event: {
        eventId: true,
        eventName: true,
        place: true,
        date: true,
        startTime: true,
        endTime: true,
      },
      poll: {
        pollId: true,
        title: true,
        description: true,
        closeAt: true,
        isClosed: true,
        pollType: true,
      },
      polloption: {
        optionId: true,
        option: true,
        isWinner: true,
      },
    },
  });
}

async function getJobById(jobId: string): Promise<Job | null> {
  return JobRepository.findOne({
    where: { jobId },
    relations: ['event', 'poll', 'polloption'],
    select: {
      jobId: true,
      description: true,
      event: {
        eventId: true,
        eventName: true,
        place: true,
        date: true,
        startTime: true,
        endTime: true,
      },
      poll: {
        pollId: true,
        title: true,
        description: true,
        closeAt: true,
        isClosed: true,
        pollType: true,
      },
      polloption: {
        optionId: true,
        option: true,
        isWinner: true,
      },
    },
  });
}

async function addJobManually(data: CreateJobInput, event: Event): Promise<Job> {
  const newJob = new Job();
  newJob.jobName = data.jobName;
  newJob.description = data.description;
  newJob.event = event;
  return JobRepository.save(newJob);
}

export { addJobManually, getAllJobByEvent, getJobById };

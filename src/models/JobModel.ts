import { AppDataSource } from '../dataSource.js';
import { Event } from '../entities/Event.js';
import { Job } from '../entities/Job.js';
import { PollOption } from '../entities/PollOption.js';
import { CreateJobInput, UpdateJobInput } from '../validators/JobValidator.js';

const JobRepository = AppDataSource.getRepository(Job);

async function getAllJobByEvent(eventId: string): Promise<Job[]> {
  return JobRepository.find({
    where: { event: { eventId } },
    relations: ['event', 'poll', 'polloption'],
    select: {
      jobId: true,
      jobName: true,
      description: true,
      event: {
        eventId: true,
        eventName: true,
      },
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
}

async function getJobById(jobId: string): Promise<Job | null> {
  return JobRepository.findOne({
    where: { jobId },
    relations: ['event', 'poll', 'polloption'],
    select: {
      jobId: true,
      jobName: true,
      description: true,
      event: {
        eventId: true,
        eventName: true,
      },
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
}

async function addJobManually(data: CreateJobInput, event: Event): Promise<Job> {
  const newJob = new Job();
  newJob.jobName = data.jobName;
  newJob.description = data.description;
  newJob.event = event;
  return JobRepository.save(newJob);
}

async function addJobAuto(polloption: PollOption, event: Event): Promise<Job> {
  const newJob = new Job();
  newJob.jobName = polloption.joboption;
  newJob.event = event;
  newJob.poll = polloption.poll;
  newJob.polloption = polloption;
  return JobRepository.save(newJob);
}

async function updateJob(data: UpdateJobInput, jobId: string): Promise<Job | null> {
  const job = await JobRepository.findOne({
    where: { jobId },
    relations: ['event', 'poll', 'polloption'],
    select: {
      jobId: true,
      jobName: true,
      description: true,
      event: {
        eventId: true,
        eventName: true,
      },
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

  if (!job) {
    return null;
  }

  job.jobName = data.jobName;
  job.description = data.description;

  return JobRepository.save(job);
}

async function deleteJob(jobId: string): Promise<void> {
  const job = await JobRepository.findOne({
    where: { jobId },
  });
  if (!job) {
    return;
  }

  await JobRepository.remove(job);
}
export { addJobAuto, addJobManually, deleteJob, getAllJobByEvent, getJobById, updateJob };

import { AppDataSource } from '../dataSource.js';
import { Job } from '../entities/Job.js';
import { JobAssignment } from '../entities/JobAssignment.js';
import { PollVote } from '../entities/PollVote.js';

const JobAssignmentRepository = AppDataSource.getRepository(JobAssignment);

async function getAllJobAssignmentByJob(jobId: string): Promise<JobAssignment[]> {
  return JobAssignmentRepository.find({
    where: { job: { jobId } },
    relations: ['user', 'job', 'pollvote'],
    select: {
      assignmentId: true,
      isLeader: true,
      user: {
        name: true,
      },
      job: {
        jobName: true,
      },
      pollvote: {
        polloption: {
          option: true,
        },
      },
    },
  });
}

async function getJobAssignmentById(assignmentId: string): Promise<JobAssignment | null> {
  return JobAssignmentRepository.findOne({
    where: { assignmentId },
    relations: ['user', 'job', 'pollvote'],
    select: {
      assignmentId: true,
      isLeader: true,
      user: {
        name: true,
      },
      job: {
        jobName: true,
      },
      pollvote: {
        polloption: {
          option: true,
        },
      },
    },
  });
}

async function addJobAssignmentAuto(pollvote: PollVote, job: Job): Promise<JobAssignment> {
  const newJobAssignemnt = new JobAssignment();
  newJobAssignemnt.pollvote = pollvote;
  newJobAssignemnt.job = job;
  newJobAssignemnt.user = pollvote.user;
  return JobAssignmentRepository.save(newJobAssignemnt);
}

export { addJobAssignmentAuto, getAllJobAssignmentByJob, getJobAssignmentById };

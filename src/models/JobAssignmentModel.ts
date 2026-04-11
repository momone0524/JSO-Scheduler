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
        userId: true,
        name: true,
      },
      job: {
        jobId: true,
        jobName: true,
      },
      pollvote: {
        polloption: {
          joboption: true,
          scheduleoption: true,
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
        userId: true,
        name: true,
      },
      job: {
        jobId: true,
        jobName: true,
      },
      pollvote: {
        polloption: {
          joboption: true,
          scheduleoption: true,
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

async function deleteJobAssignment(assignmentId: string): Promise<void> {
  const jobAssignment = await JobAssignmentRepository.findOne({ where: { assignmentId } });

  if (!jobAssignment) {
    return;
  }

  await JobAssignmentRepository.remove(jobAssignment);
}

export {
  addJobAssignmentAuto,
  deleteJobAssignment,
  getAllJobAssignmentByJob,
  getJobAssignmentById,
};

import { AppDataSource } from '../dataSource.js';
import { Job } from '../entities/Job.js';
import { JobAssignment } from '../entities/JobAssignment.js';
import { PollVote } from '../entities/PollVote.js';

const JobAssignmentRepository = AppDataSource.getRepository(JobAssignment);
const JobRepository = AppDataSource.getRepository(Job);

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

async function updateJobAssignment(
  assignmentId: string,
  jobId: string,
): Promise<JobAssignment | null> {
  const jobAssignment = await JobAssignmentRepository.findOne({
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

  if (!jobAssignment) {
    return null;
  }

  const newJob = await JobRepository.findOne({ where: { jobId } });

  if (!newJob) {
    return null;
  }
  jobAssignment.job = newJob;

  return JobAssignmentRepository.save(jobAssignment);
}

async function deleteJobAssignment(assignmentId: string): Promise<void> {
  const jobAssignment = await JobAssignmentRepository.findOne({ where: { assignmentId } });

  if (!jobAssignment) {
    return;
  }

  await JobAssignmentRepository.remove(jobAssignment);
}

async function isLeaderSet(assignmentId: string): Promise<JobAssignment | null> {
  const assignment = await JobAssignmentRepository.findOne({
    where: { assignmentId },
    relations: ['user'],
    select: {
      pollId: true,
      title: true,
      description: true,
      closeAt: true,
      isClosed: true,
      pollType: true,
      user: {
        userId: true,
        name: true,
      },
    },
  });

  if (!poll) {
    return null;
  }

  const now = new Date();

  if (poll.closeAt <= now && !poll.isClosed) {
    poll.isClosed = true;
  }
  return PollRepository.save(poll);
}

export {
  addJobAssignmentAuto,
  deleteJobAssignment,
  getAllJobAssignmentByJob,
  getJobAssignmentById,
  updateJobAssignment,
};

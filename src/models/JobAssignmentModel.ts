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

async function isLeaderSet(jobId: string): Promise<JobAssignment[]> {
  const jobassignment = await JobAssignmentRepository.find({
    where: { job: { jobId } },
    relations: ['user', 'job'],
    select: {
      assignmentId: true,
      isLeader: true,
      user: {
        userId: true,
        name: true,
        gradeYear: true,
        birthday: true,
        role: true,
      },
      job: {
        jobId: true,
        jobName: true,
      },
    },
  });

  // いったん全員falseにする
  for (const assignment of jobassignment) {
    assignment.isLeader = false;
  }

  // Board Member だけ取り出す
  const boardAssignments = jobassignment.filter(
    (assignment) => assignment.user.role === 'Board Member',
  );

  let candidateList: JobAssignment[];

  // Board Member がいればその人たちを対象にする
  if (boardAssignments.length > 0) {
    candidateList = boardAssignments;
  } else {
    // いなければ全体を見る
    candidateList = jobassignment;
  }

  let leader: JobAssignment | null = null;

  for (let i = 0; i < candidateList.length; i++) {
    const current = candidateList[i];

    if (!leader) {
      leader = current;
      continue;
    }

    // gradeYear が高い人を優先
    if (current.user.gradeYear > leader.user.gradeYear) {
      leader = current;
      continue;
    }

    // gradeYear が同じなら birthday 比較
    const currentBirthday = new Date(current.user.birthday).getTime();
    const leaderBirthday = new Date(leader.user.birthday).getTime();
    if (currentBirthday < leaderBirthday) {
      leader = current;
    }
  }
  if (leader) {
    leader.isLeader = true;
  }

  return await JobAssignmentRepository.save(jobassignment);
}

export {
  addJobAssignmentAuto,
  deleteJobAssignment,
  getAllJobAssignmentByJob,
  getJobAssignmentById,
  isLeaderSet,
  updateJobAssignment,
};

import { Request, Response } from 'express';
import { getJobById } from '../models/JobModel(仮).js';
import { getPollOptionById } from '../models/PollOptionModel.js';
///// （仮）を変更する！！！！！
import {
  addJobAssignmentAuto,
  getAllJobAssignmentByJob,
  getJobAssignmentById,
} from '../models/JobAssignmentModel(仮).js';
import { getAllPollVoteByOption } from '../models/PollVoteModel.js';
import { parseDatabaseError } from '../utils/db-utils.js';

// 自動生成！！！！
async function CreateNewJobAssignmentAuto(req: Request, res: Response): Promise<void> {
  const { jobId } = req.params;

  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  // Jobがなければエラー
  const job = await getJobById(jobId);
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  // PollOPtionがなければエラー
  const polloption = await getPollOptionById(job.polloption.optionId);
  if (!polloption) {
    res.status(404).json({ error: 'PollOption not found' });
    return;
  }

  // pollVoteがなければエラー
  // 特定のpolloptionに属するpollvoteを表示するにはoptionIdが必要
  // 今 Job が手動作成で、polloption を持っていない
  const pollvote = await getAllPollVoteByOption(job.polloption.optionId);
  if (pollvote.length === 0) {
    res.status(404).json({ error: 'No Vote for this Job' });
    return;
  }

  try {
    const assignment = [];
    for (const vote of pollvote) {
      const newJobAssignemnt = await addJobAssignmentAuto(vote, job);
      assignment.push(newJobAssignemnt);
      console.log(newJobAssignemnt);
    }
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getJobAssignmentInfo(req: Request, res: Response): Promise<void> {
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const jobAssignment = await getJobAssignmentById(req.params.assignmentId);

  if (!jobAssignment) {
    res.status(404).json({ error: 'JobAssignment not found' });
    return;
  }
  res.json({ jobAssignment });
}

async function getJobAssignmentInJob(req: Request, res: Response): Promise<void> {
  const { jobId } = req.params;
  // ログインしていなければエラー
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const job = await getAllJobAssignmentByJob(jobId);

  // Jobがなければエラー
  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  const jobassignment = await getJobById(jobId);
  if (!jobassignment) {
    res.status(404).json({ error: 'JobAssignment not found' });
    return;
  }
  res.json({ jobassignment });
}

export { CreateNewJobAssignmentAuto, getJobAssignmentInfo, getJobAssignmentInJob };

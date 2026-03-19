import { Request, Response } from 'express';
import { getEventById } from '../models/EventModel.js';
import {
  addJobAssignmentAuto,
  getAllJobAssignmentByJob,
  getJobAssignmentById,
} from '../models/JobAssignmentModel.js';
import { getJobById } from '../models/JobModel.js';
import { getPollById } from '../models/PollModel.js';
import { getPollOptionById } from '../models/PollOptionModel.js';
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

  // Eventがなければエラー
  const event = await getEventById(job.event.eventId);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }

  // Pollの種類が"job"でなければエラー
  const polltype = await getPollById(event.poll.pollId);
  if (polltype.pollType === 'schedule') {
    res.status(40).json({ error: 'You cannot create Job from Schedule Poll' });
    return;
  }

  // PollOPtionがなければエラー
  const polloption = await getPollOptionById(job.polloption.optionId);
  if (!polloption) {
    res.status(404).json({ error: 'PollOption not found' });
    return;
  }

  // pollVoteがなければエラー
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

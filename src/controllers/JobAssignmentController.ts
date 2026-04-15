import { Request, Response } from 'express';
import { getEventById } from '../models/EventModel.js';
import {
  addJobAssignmentAuto,
  deleteJobAssignment,
  getAllJobAssignmentByJob,
  getJobAssignmentById,
  updateJobAssignment,
} from '../models/JobAssignmentModel.js';
import { getJobById } from '../models/JobModel.js';
import { getPollById } from '../models/PollModel.js';
import { getPollOptionById } from '../models/PollOptionModel.js';
import { getAllPollVoteByOption } from '../models/PollVoteModel.js';
import { getUserById } from '../models/UserModel.js';
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
  const jobpoll = event.poll.find((p) => p.pollType == 'job');
  if (!jobpoll) {
    res.status(404).json({ error: 'Job poll not found in this event' });
    return;
  }

  const polltype = await getPollById(jobpoll.pollId);
  if (polltype.pollType === 'schedule') {
    res.status(404).json({ error: 'You cannot create Job from Schedule Poll' });
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
  const jobassignment = await getAllJobAssignmentByJob(jobId);

  // JobAssignmentがなければエラー
  if (!jobassignment) {
    res.status(404).json({ error: 'JobAssignment not found' });
    return;
  }
  res.json({ jobassignment });
}

async function updateJobAssignmentInfo(req: Request, res: Response): Promise<void> {
  const { userId, assignmentId } = req.params;
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const jobAssignment = await getJobAssignmentById(assignmentId);
  if (!jobAssignment) {
    res.status(404).json({ error: 'JobAssignment not found' });
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (req.session.authenticatedUser.userId !== req.params.userId) {
    res.sendStatus(403);
    return;
  }

  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to update JobAssignment' });
    return;
  }

  const { isLeader } = req.body;
  if (typeof isLeader !== 'boolean') {
    res.status(400).json({ error: 'isLeader must be boolean' });
    return;
  }

  try {
    const updated = await updateJobAssignment(assignmentId, isLeader);

    if (!updated) {
      res.status(404).json({ error: 'JobAssignment not found' });
      return;
    }

    res.json({ jobAssignment: updated });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function deleteJobAssignmentInfo(req: Request, res: Response): Promise<void> {
  const { userId, assignmentId } = req.params;
  if (!req.session.isLoggedIn) {
    res.sendStatus(401);
    return;
  }

  const jobAssignment = await getJobAssignmentById(assignmentId);
  if (!jobAssignment) {
    res.status(404).json({ error: 'JobAssignment not found' });
    return;
  }

  const user = await getUserById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (req.session.authenticatedUser.userId !== req.params.userId) {
    res.sendStatus(403);
    return;
  }

  if (user.role !== 'Board Member') {
    res.status(403).json({ error: 'You do not have permission to delete JobAssignment' });
    return;
  }

  await deleteJobAssignment(assignmentId);
  res.sendStatus(204);
}

export {
  CreateNewJobAssignmentAuto,
  deleteJobAssignmentInfo,
  getJobAssignmentInfo,
  getJobAssignmentInJob,
  updateJobAssignmentInfo,
};

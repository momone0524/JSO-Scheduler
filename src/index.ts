import express, { Express } from 'express';
import './config.js'; // do not remove this line
import {
  CreateNewAttendance,
  deleteAttendance,
  getAttendanceInfo,
  getAttendanceOfUserInEvent,
  getAttendances,
  updateAttendance,
} from './controllers/AttendanceController.js';
import {
  CreateNewEventManual,
  deleteEvent,
  getEventInfo,
  getEvents,
  updateEvent,
  updateEventFromPollAuto,
} from './controllers/EventController.js';
import {
  CreateNewJobAssignmentAuto,
  deleteJobAssignmentInfo,
  getJobAssignmentInfo,
  getJobAssignmentInJob,
  settingLeader,
  updateJobAssignmentInfo,
} from './controllers/JobAssignmentController.js';
import {
  CreateNewJobAuto,
  CreateNewJobManual,
  deleteJobInfo,
  getJobInEvent,
  getJobInfo,
  updateJobInfo,
} from './controllers/JobController.js';
import {
  closedPollExpire,
  CreateNewPoll,
  deletePollInfo,
  getPollInfo,
  getPolls,
  updatePollInfo,
} from './controllers/PollController.js';
import {
  CreateNewPollOption,
  deletePollOptionInfo,
  getPollOptionInfo,
  getPollOptions,
  settingWinner,
  updatePollOptionInfo,
} from './controllers/PollOptionController.js';
import {
  CreateNewPollVote,
  deletePollVoteInfo,
  getPollVoteInfo,
  getPollVoteInOption,
  getPollVotes,
} from './controllers/PollVoteController.js';
import {
  deleteUser,
  getMe,
  getUserProfile,
  getUsers,
  logIn,
  logOut,
  registerUser,
  updateUsers,
} from './controllers/UserController.js';
import { sessionMiddleware } from './sessionConfig.js';

const app: Express = express();

app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
// This allows the client to access any file inside the `public` directory
// Only put file that you actually want to be publicly accessibly in the `public` folder
app.use(express.static('public', { extensions: ['html'] }));

// -- Routes --------------------------------------------------
// Register your routes below this line
// User
app.post('/users', registerUser);
app.post('/login', logIn);
app.delete('/sessions', logOut);
app.get('/users/:userId', getUserProfile);
app.get('/users', getUsers);
app.get('/api/me', getMe);
app.patch('/users/:userId/update', updateUsers);
app.delete('/users/:userId/delete', deleteUser);

// Event
app.post('/events', CreateNewEventManual);
app.get('/events', getEvents);
app.get('/events/:eventId', getEventInfo);
app.patch('/events/:eventId/update/auto', updateEventFromPollAuto);
app.patch('/events/:eventId/update', updateEvent);
app.delete('/events/:eventId/delete', deleteEvent);

// Attendance
app.post('/events/:eventId/attendance', CreateNewAttendance);
app.get('/events/:eventId/attendance', getAttendances);
app.get('/events/:eventId/attendance/user', getAttendanceOfUserInEvent);
app.get('/attendance/:attendanceId', getAttendanceInfo);
app.patch('/attendance/:attendanceId/update', updateAttendance);
app.delete('/attendance/:attendanceId/delete', deleteAttendance);

// Poll
app.post('/events/:eventId/polls', CreateNewPoll);
app.get('/polls', getPolls);
app.get('/polls/:pollId', getPollInfo);
app.patch('/polls/:pollId/close', closedPollExpire);
app.patch('/polls/:pollId/update', updatePollInfo);
app.delete('/polls/:pollId/delete', deletePollInfo);

// PollOption
app.post('/polls/:pollId/pollOptions', CreateNewPollOption);
app.get('/polls/:pollId/pollOptions', getPollOptions);
app.get('/pollOptions/:optionId', getPollOptionInfo);
app.patch('/pollOptions/:optionId/update', updatePollOptionInfo);
app.patch('/polls/:pollId/winner', settingWinner);
app.delete('/pollOptions/:optionId/delete', deletePollOptionInfo);

// PollVote
app.post('/polls/:pollId/pollOptions/:optionId/pollvote', CreateNewPollVote);
app.get('/pollvote', getPollVotes);
app.get('/polls/:pollId/pollOptions/:optionId/pollvote/:voteId', getPollVoteInfo);
app.get('/polls/:pollId/pollOptions/:optionId/pollvote', getPollVoteInOption);
app.delete('/pollvote/:voteId/delete', deletePollVoteInfo);

// Job
app.post('/event/:eventId/jobs', CreateNewJobManual);
app.post('/event/:eventId/jobs/auto', CreateNewJobAuto);
app.get('/event/:eventId/jobs', getJobInEvent);
app.get('/event/:eventId/jobs/:jobId', getJobInfo);
app.patch('/jobs/:jobId/update', updateJobInfo);
app.delete('/jobs/:jobId/delete', deleteJobInfo);

// JobAssignment
app.post('/jobs/:jobId/assignment/auto', CreateNewJobAssignmentAuto);
app.get('/jobs/:jobId/assignment', getJobAssignmentInJob);
app.get('/jobs/:jobId/assignment/:assignmentId', getJobAssignmentInfo);
app.patch('/assignments/:assignmentId/update/:jobId', updateJobAssignmentInfo);
app.patch('/jobs/:jobId/leader', settingLeader);
app.delete('/assignments/:assignmentId/delete', deleteJobAssignmentInfo);
app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

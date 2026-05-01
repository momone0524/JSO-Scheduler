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
app.use(express.static('frontend/build'));

// -- Routes --------------------------------------------------
// Register your routes below this line
// User
app.post('/api/users', registerUser);
app.post('/api/login', logIn);
app.delete('/api/sessions', logOut);
app.get('/api/users/:userId', getUserProfile);
app.get('/api/users', getUsers);
app.get('/api/me', getMe);
app.patch('/api/users/:userId/update', updateUsers);
app.delete('/api/users/:userId/delete', deleteUser);

// Event
app.post('/api/events', CreateNewEventManual);
app.get('/api/events', getEvents);
app.get('/api/events/:eventId', getEventInfo);
app.patch('/api/events/:eventId/update/auto', updateEventFromPollAuto);
app.patch('/api/events/:eventId/update', updateEvent);
app.delete('/api/events/:eventId/delete', deleteEvent);

// Attendance
app.post('/api/events/:eventId/attendance', CreateNewAttendance);
app.get('/api/events/:eventId/attendance', getAttendances);
app.get('/api/events/:eventId/attendance/user', getAttendanceOfUserInEvent);
app.get('/api/attendance/:attendanceId', getAttendanceInfo);
app.patch('/api/attendance/:attendanceId/update', updateAttendance);
app.delete('/api/attendance/:attendanceId/delete', deleteAttendance);

// Poll
app.post('/api/events/:eventId/polls', CreateNewPoll);
app.get('/api/polls', getPolls);
app.get('/api/polls/:pollId', getPollInfo);
app.patch('/api/polls/:pollId/close', closedPollExpire);
app.patch('/api/polls/:pollId/update', updatePollInfo);
app.delete('/api/polls/:pollId/delete', deletePollInfo);

// PollOption
app.post('/api/polls/:pollId/pollOptions', CreateNewPollOption);
app.get('/api/polls/:pollId/pollOptions', getPollOptions);
app.get('/api/pollOptions/:optionId', getPollOptionInfo);
app.patch('/api/pollOptions/:optionId/update', updatePollOptionInfo);
app.patch('/api/polls/:pollId/winner', settingWinner);
app.delete('/api/pollOptions/:optionId/delete', deletePollOptionInfo);

// PollVote
app.post('/api/polls/:pollId/pollOptions/:optionId/pollvote', CreateNewPollVote);
app.get('/api/pollvote', getPollVotes);
app.get('/api/polls/:pollId/pollOptions/:optionId/pollvote/:voteId', getPollVoteInfo);
app.get('/api/polls/:pollId/pollOptions/:optionId/pollvote', getPollVoteInOption);
app.delete('/api/pollvote/:voteId/delete', deletePollVoteInfo);

// Job
app.post('/api/event/:eventId/jobs', CreateNewJobManual);
app.post('/api/event/:eventId/jobs/auto', CreateNewJobAuto);
app.get('/api/event/:eventId/jobs', getJobInEvent);
app.get('/api/event/:eventId/jobs/:jobId', getJobInfo);
app.patch('/api/jobs/:jobId/update', updateJobInfo);
app.delete('/api/jobs/:jobId/delete', deleteJobInfo);

// JobAssignment
app.post('/api/jobs/:jobId/assignment/auto', CreateNewJobAssignmentAuto);
app.get('/api/jobs/:jobId/assignment', getJobAssignmentInJob);
app.get('/api/jobs/:jobId/assignment/:assignmentId', getJobAssignmentInfo);
app.patch('/api/assignments/:assignmentId/update/:jobId', updateJobAssignmentInfo);
app.patch('/api/jobs/:jobId/leader', settingLeader);
app.delete('/api/assignments/:assignmentId/delete', deleteJobAssignmentInfo);
app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

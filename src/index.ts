import express, { Express } from 'express';
import './config.js'; // do not remove this line
import {
  CreateNewAttendance,
  getAttendanceInfo,
  getAttendances,
} from './controllers/AttendanceController.js';
import { CreateNewEventManual, getEventInfo, getEvents } from './controllers/EventController.js';
import {
  CreateNewJobAssignmentAuto,
  getJobAssignmentInfo,
  getJobAssignmentInJob,
} from './controllers/JobAssignmentController(仮).js';
import { CreateNewJobManual, getJobInEvent, getJobInfo } from './controllers/JobController(仮).js';
import { CreateNewPoll, getPollInfo, getPolls } from './controllers/PollController.js';
import {
  CreateNewPollOption,
  getPollOptionInfo,
  getPollOptions,
} from './controllers/PollOptionController.js';
import {
  CreateNewPollVote,
  getPollVoteInfo,
  getPollVoteInOption,
  getPollVotes,
} from './controllers/PollVoteController.js';
import {
  getUserProfile,
  getUsers,
  logIn,
  logOut,
  registerUser,
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

// Event
app.post('/events/:userId', CreateNewEventManual);
app.get('/events', getEvents);
app.get('/events/:eventId', getEventInfo);

// Attendance
app.post('/events/:eventId/attendance/:userId', CreateNewAttendance);
app.get('/events/:eventId/attendance', getAttendances);
app.get('/events/:eventId/attendance/:attendanceId', getAttendanceInfo);

// Poll
app.post('/polls/:userId', CreateNewPoll);
app.get('/polls', getPolls);
app.get('/polls/:pollId', getPollInfo);

// PollOption
app.post('/polls/:pollId/pollOptions/:userId', CreateNewPollOption);
app.get('/polls/:pollId/pollOptions', getPollOptions);
app.get('/pollOptions/:optionId', getPollOptionInfo);

// PollVote
app.post('/polls/:pollId/pollOptions/:optionId/pollvote/:userId', CreateNewPollVote);
app.get('/polls/:pollId/pollOptions/:optionId/pollvote', getPollVotes);
app.get('/polls/:pollId/pollOptions/:optionId/pollvote/:voteId', getPollVoteInfo);
app.get('/polls/:pollId/pollOptions/:optionId/pollvoteInOption', getPollVoteInOption);

// Job
app.post('/event/:eventId/jobs/:userId', CreateNewJobManual);
app.get('/event/:eventId/jobs', getJobInEvent);
app.get('/event/:eventId/jobs/:jobId', getJobInfo);

// JobAssignment
app.post('/jobs/:jobId/assignment/auto', CreateNewJobAssignmentAuto);
app.get('/jobs/:jobId/assignment', getJobAssignmentInJob);
app.get('/jobs/:jobId/assignment/:assignmentId', getJobAssignmentInfo);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

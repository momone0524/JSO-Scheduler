import express, { Express } from 'express';
import './config.js'; // do not remove this line
import {
  CreateNewAttendance,
  getAttendanceInfo,
  getAttendances,
} from './controllers/AttendanceController.js';
import { CreateNewEventManual, getEventInfo, getEvents } from './controllers/EventController.js';
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
app.post('/events/:eventId/attendance', CreateNewAttendance);
app.get('/events/:eventId/attendance/', getAttendances);
app.get('/events/:eventId/attendance/:attendanceId', getAttendanceInfo);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

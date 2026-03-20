import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Attendance } from './Attendance.js';
import { Event } from './Event.js';
import { JobAssignment } from './JobAssignment.js';
import { Poll } from './Poll.js';
import { PollVote } from './PollVote.js';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;

  @BeforeInsert()
  generateId(): void {
    this.userId = uuidv7();
  }

  @Column()
  name: string;

  @Column()
  gradeYear: number;

  @Column()
  major: string;

  @Column()
  birthday: Date;

  @Column()
  language: string;

  @Column()
  role: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  // (Event.ts) one side: User
  @OneToMany(() => Event, (event) => event.user)
  events: Relation<Event>[];

  // (Attendance.ts) one side: User
  @OneToMany(() => Attendance, (attendance) => attendance.user, { cascade: ['remove'] })
  attendances: Relation<Attendance>[];

  // (Poll.ts) one side: User
  @OneToMany(() => Poll, (poll) => poll.user)
  polls: Relation<Poll>[];

  // (PollVote.ts) one side: User
  @OneToMany(() => PollVote, (pollvote) => pollvote.user, { cascade: ['remove'] })
  pollvotes: Relation<PollVote>[];

  // (JobAssignment.ts) one side: User
  @OneToMany(() => JobAssignment, (jobassignment) => jobassignment.user, { cascade: ['remove'] })
  jobassignments: Relation<JobAssignment>[];
}

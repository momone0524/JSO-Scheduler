import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Attendance } from './Attendance.js';
import { Job } from './Job.js';
import { Poll } from './Poll.js';
import { User } from './User.js';

@Entity()
export class Event {
  @PrimaryColumn()
  eventId: string;

  @BeforeInsert()
  generateId(): void {
    this.eventId = uuidv7();
  }

  @Column()
  eventName: string;

  @Column()
  place: string;

  @Column()
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  // (User.ts) many side: Event
  @ManyToOne(() => User, (user) => user.events, { nullable: true, onDelete: 'SET NULL' })
  user: Relation<User>;

  // (Poll.ts) one side: Event
  @OneToMany(() => Poll, (poll) => poll.event, { cascade: ['remove'] })
  poll: Relation<Poll>[];

  // (Attendance.ts) one side: Event
  @OneToMany(() => Attendance, (attendance) => attendance.event, { cascade: ['remove'] })
  attendances: Relation<Attendance>[];

  // (Job.ts) one side: Event
  @OneToMany(() => Job, (job) => job.event, { cascade: ['remove'] })
  jobs: Relation<Job>[];
}

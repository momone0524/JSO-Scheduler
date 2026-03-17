import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Attendance } from './Attendance.js';
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
  @ManyToOne(() => User, (user) => user.events)
  user: Relation<User>;

  // (Poll.ts)
  @OneToOne(() => Poll, (poll) => poll.events, { nullable: true })
  @JoinColumn()
  poll: Relation<Poll> | null;

  // (Attendance.ts) one side: Event
  @OneToMany(() => Attendance, (attendance) => attendance.event)
  attendances: Relation<Attendance>;
}

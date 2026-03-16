import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
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

  // (createdBy column) many side: Event
  @ManyToOne(() => User, (user) => user.events)
  user: Relation<User>;

  // (pollId column)
  @OneToOne(() => Poll, (poll) => poll.events, { nullable: true })
  @JoinColumn()
  poll: Relation<Poll> | null;
}

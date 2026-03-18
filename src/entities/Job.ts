import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Event } from './Event.js';
import { Poll } from './Poll.js';
import { PollOption } from './PollOption.js';
import { User } from './User.js';

@Entity()
export class Job {
  @PrimaryColumn()
  jobId: string;

  @BeforeInsert()
  generateId(): void {
    this.jobId = uuidv7();
  }

  @Column({ default: false })
  isLeader: boolean;

  @Column({ nullable: true })
  description: string;

  // (Poll.ts) many side: Job
  @ManyToOne(() => Poll, (poll) => poll.jobs)
  poll: Relation<Poll>;

  // (PollOption.ts) many side: Job
  @ManyToOne(() => PollOption, (polloption) => polloption.jobs)
  polloption: Relation<PollOption>;

  // (User.ts) many side: Job
  @ManyToOne(() => User, (user) => user.jobs)
  user: Relation<User>;

  // (Event.ts) many side: Job
  @ManyToOne(() => Event, (event) => event.jobs)
  event: Relation<Event>;
}

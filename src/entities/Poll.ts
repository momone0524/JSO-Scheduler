import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Event } from './Event.js';
import { Job } from './Job.js';
import { PollOption } from './PollOption.js';
import { PollVote } from './PollVote.js';
import { User } from './User.js';

@Entity()
export class Poll {
  @PrimaryColumn()
  pollId: string;

  @BeforeInsert()
  generateId(): void {
    this.pollId = uuidv7();
  }

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  closeAt: Date;

  @Column({ default: false })
  isClosed: boolean;

  //　Pollが削除できるようになったらnullalbeを消す！！
  @Column({ nullable: true })
  pollType: string;

  // (Event.ts)
  @OneToOne(() => Event, (event) => event.poll)
  event: Relation<Event>;

  // (User.ts) many side: Poll
  @ManyToOne(() => User, (user) => user.polls)
  user: Relation<User>;

  // (PollOption.ts) one side: Poll
  @OneToMany(() => PollOption, (pollOption) => pollOption.poll)
  pollOptions: Relation<PollOption>[];

  // (PollVote.ts) one side: Poll
  @OneToMany(() => PollVote, (pollvote) => pollvote.poll)
  pollvotes: Relation<PollVote>[];

  // (Job.ts) one side: Poll
  @OneToMany(() => Job, (job) => job.poll)
  jobs: Relation<Job>[];
}

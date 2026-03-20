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
import { Job } from './Job.js';
import { Poll } from './Poll.js';
import { PollVote } from './PollVote.js';

@Entity()
export class PollOption {
  @PrimaryColumn()
  optionId: string;

  @BeforeInsert()
  generateId(): void {
    this.optionId = uuidv7();
  }

  @Column({ nullable: true })
  joboption: string;

  @Column({ nullable: true })
  scheduleoption: Date;

  @Column({ default: false })
  isWinner: boolean;

  // (Poll.ts) many side: PollOption
  @ManyToOne(() => Poll, (poll) => poll.pollOptions)
  poll: Relation<Poll>;

  // (PollVote.ts) one side: PollOption
  @OneToMany(() => PollVote, (pollvote) => pollvote.polloption)
  pollvotes: Relation<PollVote>[];

  // (Job.ts) one side: PollOption
  @OneToMany(() => Job, (job) => job.polloption)
  jobs: Relation<Job>[];
}

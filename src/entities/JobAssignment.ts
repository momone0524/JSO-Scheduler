import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Job } from './Job.js';
import { PollVote } from './PollVote.js';
import { User } from './User.js';

@Entity()
export class JobAssignment {
  @PrimaryColumn()
  assignmentId: string;

  @BeforeInsert()
  generateId(): void {
    this.assignmentId = uuidv7();
  }

  @Column({ default: false })
  isLeader: boolean;

  // (User.ts) many side: JobAssignment
  @ManyToOne(() => User, (user) => user.jobassignments, { onDelete: 'CASCADE' })
  user: Relation<User>;

  // (Job.ts) many side: JobAssignment
  @ManyToOne(() => Job, (job) => job.jobassignments)
  job: Relation<Job>;

  // (PollVote.ts) many side: JobAssignment
  @ManyToOne(() => PollVote, (pollvote) => pollvote.jobassignments)
  pollvote: Relation<PollVote>;
}

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
import { Event } from './Event.js';
import { JobAssignment } from './JobAssignment.js';
import { Poll } from './Poll.js';
import { PollOption } from './PollOption.js';

@Entity()
export class Job {
  @PrimaryColumn()
  jobId: string;

  @BeforeInsert()
  generateId(): void {
    this.jobId = uuidv7();
  }

  @Column()
  jobName: string;

  @Column({ nullable: true })
  description: string;

  // (Poll.ts) many side: Job
  @ManyToOne(() => Poll, (poll) => poll.jobs)
  poll: Relation<Poll>;

  // (PollOption.ts) many side: Job
  @ManyToOne(() => PollOption, (polloption) => polloption.jobs)
  polloption: Relation<PollOption>;

  // (Event.ts) many side: Job
  @ManyToOne(() => Event, (event) => event.jobs, { onDelete: 'CASCADE' })
  event: Relation<Event>;

  // (JobAssignment.ts) one side: Job
  @OneToMany(() => JobAssignment, (jobassignment) => jobassignment.job)
  jobassignments: Relation<JobAssignment>[];
}

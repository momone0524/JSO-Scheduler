import { BeforeInsert, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Poll } from './Poll.js';
import { PollOption } from './PollOption.js';
import { User } from './User.js';

@Entity()
export class PollVote {
  @PrimaryColumn()
  voteId: string;

  @BeforeInsert()
  generateId(): void {
    this.voteId = uuidv7();
  }

  // (User.ts) many side: PollVote
  @ManyToOne(() => User, (user) => user.pollvotes)
  user: Relation<User>;

  // (PollOption.ts) many side: PollVote
  @ManyToOne(() => PollOption, (polloption) => polloption.pollvotes)
  polloption: Relation<PollOption>;

  // (Poll.ts) many side: PollVote
  @ManyToOne(() => Poll, (poll) => poll.pollvotes)
  poll: Relation<Poll>;
}

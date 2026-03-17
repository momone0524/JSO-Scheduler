import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Poll } from './Poll.js';

@Entity()
export class PollOption {
  @PrimaryColumn()
  optionId: string;

  @BeforeInsert()
  generateId(): void {
    this.optionId = uuidv7();
  }

  @Column()
  option: string;

  @Column({ default: false })
  isWinner: boolean;

  // (Poll.ts) many side: PollOption
  @ManyToOne(() => Poll, (poll) => poll.pollOptions)
  poll: Relation<Poll>;
}

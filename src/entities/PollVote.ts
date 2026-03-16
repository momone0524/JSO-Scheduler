import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
@Entity()
export class PollVote {
  @PrimaryColumn()
  voteId: string;

  @BeforeInsert()
  generateId(): void {
    this.voteId = uuidv7();
  }

  @Column()
  optionId: string;

  @Column()
  userId: string;
}

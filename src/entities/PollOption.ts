import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
@Entity()
export class PollOption {
  @PrimaryColumn()
  optionId: string;

  @BeforeInsert()
  generateId(): void {
    this.optionId = uuidv7();
  }

  @Column()
  pollId: string;

  @Column()
  OptionDat: string;

  @Column()
  isWinner: string;

  @Column()
  title: Date;

  @Column({ default: false })
  description: boolean;
}

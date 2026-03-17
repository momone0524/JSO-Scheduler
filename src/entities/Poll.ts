import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Event } from './Event.js';
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

  @Column()
  description: string;

  @Column()
  closeAt: Date;

  @Column({ default: false })
  isClosed: boolean;

  // (Event.ts)
  @OneToOne(() => Event, (event) => event.poll)
  event: Relation<Event>;

  // (User.ts) many side: Poll
  @ManyToOne(() => User, (user) => user.polls)
  user: Relation<User>;
}

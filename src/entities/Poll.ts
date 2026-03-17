import { BeforeInsert, Column, Entity, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Event } from './Event.js';

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
  createdBy: string;

  @Column()
  closeAt: Date;

  @Column({ default: false })
  idClosed: boolean;

  // (Event.ts)
  @OneToOne(() => Event, (event) => event.poll)
  event: Relation<Event>;
}

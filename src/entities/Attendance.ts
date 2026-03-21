import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { Event } from './Event.js';
import { User } from './User.js';

@Entity()
export class Attendance {
  @PrimaryColumn()
  attendanceId: string;

  @BeforeInsert()
  generateId(): void {
    this.attendanceId = uuidv7();
  }

  @Column()
  attend: string;

  @Column({ type: 'time', nullable: true })
  attendTime: string;

  // (User.ts) many side: Attendance
  @ManyToOne(() => User, (user) => user.attendances, { onDelete: 'CASCADE' })
  user: Relation<User>;

  // (Event.ts) many side: Attendance
  @ManyToOne(() => Event, (event) => event.attendances, { onDelete: 'CASCADE' })
  event: Relation<Event>;
}

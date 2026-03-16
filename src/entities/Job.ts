import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
@Entity()
export class Job {
  @PrimaryColumn()
  jobId: string;

  @BeforeInsert()
  generateId(): void {
    this.jobId = uuidv7();
  }

  @Column()
  eventId: string;

  @Column()
  jobType: string;

  @Column()
  title: string;

  @Column()
  discription: Date;

  @Column({ default: false })
  leaderId: boolean;

  @Column()
  setupStart: string;
}

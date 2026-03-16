import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
@Entity()
export class JobAssignment {
  @PrimaryColumn()
  assignmentId: string;

  @BeforeInsert()
  generateId(): void {
    this.assignmentId = uuidv7();
  }

  @Column()
  jobId: string;

  @Column()
  userId: string;
}

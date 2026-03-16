import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
//import { Attendance } from './Attendance.js';

@Entity()
export class User {
  @PrimaryColumn()
  userId: string;

  @BeforeInsert()
  generateId(): void {
    this.userId = uuidv7();
  }

  @Column()
  name: string;

  @Column()
  gradeYear: number;

  @Column()
  major: string;

  @Column()
  birthday: Date;

  @Column()
  language: string;

  @Column()
  role: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  //@ManyToMany(() => Attendance, (attendance) => attendance.users)
  //attendances: Relation<Attendance>[];

  //@OneToMany(() => )
}

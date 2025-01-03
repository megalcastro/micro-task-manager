import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEnum } from 'class-validator';


export enum TaskStatus {
  TODO = 'por_hacer',
  IN_PROGRESS = 'en_progreso',
  COMPLETED = 'completada',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  @IsEnum(TaskStatus)
  status: string;

  @Column({ nullable: true })
  dueDate: Date;
}

import { IsString,Matches, IsNotEmpty, IsEnum, IsDate } from 'class-validator';
import { TaskStatus } from './task.entity';

export class CreateTaskDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'dueDate must be in the format DD/MM/YYYY' })
  dueDate: Date;
}

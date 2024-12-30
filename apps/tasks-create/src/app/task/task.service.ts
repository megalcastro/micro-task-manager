import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async createTask(title: string, description: string, status: string, dueDate: Date): Promise<Task> {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = status;
    task.dueDate = dueDate;

    return this.tasksRepository.save(task);
  }

//   async getTasks(): Promise<Task[]> {
//     return this.tasksRepository.find();
//   }

//   async getTaskById(id: number): Promise<Task> {
//     return this.tasksRepository.findOne(id);
//   }

//   async updateTask(id: number, title: string, description: string, status: string, dueDate: Date): Promise<Task> {
//     const task = await this.tasksRepository.findOne(id);
//     if (!task) {
//       throw new Error('Task not found');
//     }
//     task.title = title;
//     task.description = description;
//     task.status = status;
//     task.dueDate = dueDate;

//     return this.tasksRepository.save(task);
//   }

//   async deleteTask(id: number): Promise<void> {
//     await this.tasksRepository.delete(id);
//   }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TaskService {
  private authServiceUrl = `${process.env.AUTH_SERVICES_URL}/auth/validate-token`

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly httpService: HttpService,
  ) {}


  async validateToken(token: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(this.authServiceUrl, {
          headers: { Authorization: `Bearer ${token.split(' ')[1]}` },
        }),
      );
      
      return response.data;
    } catch (error) {
      console.log('error', error);
    }
  }



  async updateTask(id: number, title: string, description: string, status: string, dueDate: Date): Promise<Task> {
    const task = await this.tasksRepository.findOne({where:{id}});
    if (!task) {
      throw new Error('Task not found');
    }
    task.title = title;
    task.description = description;
    task.status = status;
    task.dueDate = dueDate;

    return this.tasksRepository.save(task);
  }

}

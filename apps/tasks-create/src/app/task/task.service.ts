import { Injectable , UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreateTaskDto } from './create-task.dto';

@Injectable()
export class TaskService {

  private authServiceUrl = `${process.env.AUTH_SERVICES_URL}/auth/validate-token`

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly httpService: HttpService
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


  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.status = createTaskDto.status;
    task.dueDate = createTaskDto.dueDate;

    return this.tasksRepository.save(task);
  }

}

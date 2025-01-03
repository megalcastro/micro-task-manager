import { Controller, Post, Body, UseGuards, Headers, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}


  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Headers('Authorization') authHeader: string
  ): Promise<Task> {
    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    const isValidate = await this.tasksService.validateToken(authHeader);

    console.log('isValidate', authHeader);
    if(!isValidate ){

      throw new ForbiddenException('Invalid token!!!');
    }


    return this.tasksService.createTask(createTaskDto);
  }

}

import { Controller, Get,Param, Headers, UnauthorizedException, ForbiddenException, Put, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('status') status: string,
    @Body('dueDate') dueDate: Date,
    @Headers('Authorization') authHeader: string
  ): Promise<Task> {
    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    const isValidate = await this.tasksService.validateToken(authHeader);

    if(!isValidate ){

      throw new ForbiddenException('Invalid token!!!');
    }
    return this.tasksService.updateTask(id, title, description, status, dueDate);
  }

}

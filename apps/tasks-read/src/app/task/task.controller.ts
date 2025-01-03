import { Controller, Get,Param, Headers, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @Get()
  async getTasks(@Headers('Authorization') authHeader: string): Promise<Task[]> {
    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    const isValidate = await this.tasksService.validateToken(authHeader);

    if(!isValidate ){

      throw new ForbiddenException('Invalid token!!!');
    }
    return this.tasksService.getTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: number, @Headers('Authorization') authHeader: string): Promise<Task> {

    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    const isValidate = await this.tasksService.validateToken(authHeader);

    if(!isValidate ){

      throw new ForbiddenException('Invalid token!!!');
    }
    return this.tasksService.getTaskById(id);
  }

//   @Put(':id')
//   updateTask(
//     @Param('id') id: number,
//     @Body('title') title: string,
//     @Body('description') description: string,
//     @Body('status') status: string,
//     @Body('dueDate') dueDate: Date,
//   ): Promise<Task> {
//     return this.tasksService.updateTask(id, title, description, status, dueDate);
//   }

//   @Delete(':id')
//   deleteTask(@Param('id') id: number): Promise<void> {
//     return this.tasksService.deleteTask(id);
//   }
}

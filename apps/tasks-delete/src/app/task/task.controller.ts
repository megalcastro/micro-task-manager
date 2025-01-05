import { Controller, Param, Headers, Delete, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}


  @Delete(':id')
  async deleteTask(@Param('id') id: number,@Headers('Authorization') authHeader: string): Promise<void> {

    if (!authHeader) {
      throw new UnauthorizedException('Token is required');
    }

    const isValidate = await this.tasksService.validateToken(authHeader);

    console.log('isValidate', authHeader);
    if(!isValidate ){

      throw new ForbiddenException('Invalid token!!!');
    }

    return this.tasksService.deleteTask(id);
  }
}

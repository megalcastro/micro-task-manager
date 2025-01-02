import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private readonly tasksService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('status') status: string,
    @Body('dueDate') dueDate: Date,
  ): Promise<Task> {
    return this.tasksService.createTask(title, description, status, dueDate);
  }

//   @Get()
//   getTasks(): Promise<Task[]> {
//     return this.tasksService.getTasks();
//   }

//   @Get(':id')
//   getTaskById(@Param('id') id: number): Promise<Task> {
//     return this.tasksService.getTaskById(id);
//   }

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

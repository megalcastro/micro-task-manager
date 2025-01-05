import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Task } from './task.entity';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  const mockTaskService = {
    updateTask: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'in_progress',
        dueDate: new Date(),
      };

      mockTaskService.validateToken.mockResolvedValue(true);
      mockTaskService.updateTask.mockResolvedValue(mockTask);

      const result = await controller.updateTask(
        1,
        'Updated Task',
        'Updated Description',
        'in_progress',
        new Date(),
        'Bearer valid-token',
      );

      expect(result).toEqual(mockTask);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(
        1,
        'Updated Task',
        'Updated Description',
        'in_progress',
        expect.any(Date),
      );
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      try {
        await controller.updateTask(
          1,
          'Updated Task',
          'Updated Description',
          'in_progress',
          new Date(),
          '',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.response.message).toBe('Token is required');
      }
    });

    it('should throw ForbiddenException if token is invalid', async () => {
      mockTaskService.validateToken.mockResolvedValue(false);

      try {
        await controller.updateTask(
          1,
          'Updated Task',
          'Updated Description',
          'in_progress',
          new Date(),
          'Bearer invalid-token',
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response.message).toBe('Invalid token!!!');
      }
    });

    it('should throw error if task not found', async () => {
      mockTaskService.validateToken.mockResolvedValue(true);
      mockTaskService.updateTask.mockRejectedValue(new Error('Task not found'));

      try {
        await controller.updateTask(
          1,
          'Updated Task',
          'Updated Description',
          'in_progress',
          new Date(),
          'Bearer valid-token',
        );
      } catch (error) {
        expect(error.message).toBe('Task not found');
      }
    });
  });
});

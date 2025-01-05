import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Task } from './task.entity';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  const mockTaskService = {
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
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

  describe('getTasks', () => {
    it('should return an array of tasks if token is valid', async () => {
      const mockTasks: Task[] = [
        { id: 1, title: 'Test Task', description: 'Test description', status: 'in_progress', dueDate: new Date() },
        { id: 2, title: 'Another Task', description: 'Another description', status: 'completed', dueDate: new Date() },
      ];

      mockTaskService.validateToken.mockResolvedValue(true);
      mockTaskService.getTasks.mockResolvedValue(mockTasks);

      const result = await controller.getTasks('Bearer valid-token');
      expect(result).toEqual(mockTasks);
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      await expect(controller.getTasks('')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if token is invalid', async () => {
      mockTaskService.validateToken.mockResolvedValue(false);
      await expect(controller.getTasks('Bearer invalid-token')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getTaskById', () => {
    it('should return a task if token is valid', async () => {
      const mockTask: Task = { id: 1, title: 'Test Task', description: 'Task description', status: 'in_progress', dueDate: new Date() };

      mockTaskService.validateToken.mockResolvedValue(true);
      mockTaskService.getTaskById.mockResolvedValue(mockTask);

      const result = await controller.getTaskById(1, 'Bearer valid-token');
      expect(result).toEqual(mockTask);
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      await expect(controller.getTaskById(1, '')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if token is invalid', async () => {
      mockTaskService.validateToken.mockResolvedValue(false);
      await expect(controller.getTaskById(1, 'Bearer invalid-token')).rejects.toThrow(ForbiddenException);
    });
  });
});

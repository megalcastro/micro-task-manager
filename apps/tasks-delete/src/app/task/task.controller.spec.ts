import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;

  const mockTaskService = {
    validateToken: jest.fn(),
    deleteTask: jest.fn(),
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

  describe('deleteTask', () => {
    it('should throw UnauthorizedException if no token is provided', async () => {
      const result = controller.deleteTask(1, '');
      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('should throw ForbiddenException if token is invalid', async () => {
      mockTaskService.validateToken.mockResolvedValue(null);
      const authHeader = 'Bearer invalidToken';
      const result = controller.deleteTask(1, authHeader);
      await expect(result).rejects.toThrow(ForbiddenException);
    });

    it('should call deleteTask from taskService if token is valid', async () => {
      const authHeader = 'Bearer validToken';
      mockTaskService.validateToken.mockResolvedValue(true);
      mockTaskService.deleteTask.mockResolvedValue(undefined);

      await controller.deleteTask(1, authHeader);

      expect(mockTaskService.validateToken).toHaveBeenCalledWith(authHeader);
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });
});

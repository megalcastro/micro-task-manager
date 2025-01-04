import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Task,TaskStatus } from './task.entity';
import { CreateTaskDto } from './create-task.dto';

const mockTaskService = {
  validateToken: jest.fn(),
  createTask: jest.fn(),
};

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

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

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('createTask', () => {
    it('should throw UnauthorizedException if no token is provided', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        dueDate: new Date(),
      };

      try {
        await taskController.createTask(createTaskDto, '');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Token is required');
      }
    });

    it('should throw ForbiddenException if token is invalid', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        dueDate: new Date(),
      };

    
      mockTaskService.validateToken.mockResolvedValue(false);

      try {
        await taskController.createTask(createTaskDto, 'invalid_token');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Invalid token!!!');
      }
    });

    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        dueDate: new Date(),
      };

      const mockTask = new Task();
      mockTask.id = 1;
      mockTask.title = createTaskDto.title;
      mockTask.description = createTaskDto.description;
      mockTask.status = createTaskDto.status;
      mockTask.dueDate = createTaskDto.dueDate;

      mockTaskService.validateToken.mockResolvedValue(true);
      mockTaskService.createTask.mockResolvedValue(mockTask);

      const result = await taskController.createTask(createTaskDto, 'valid_token');

      expect(result).toEqual(mockTask);
      expect(mockTaskService.validateToken).toHaveBeenCalledWith('valid_token');
      expect(mockTaskService.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });
});

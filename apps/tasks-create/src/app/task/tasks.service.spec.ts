import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';


describe('TaskService', () => {
  let service: TaskService;

  const mockTaskRepository = {
    save: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const mockToken = 'Bearer mock-token';
      const mockResponse = { data: { userId: '123', valid: true } };

      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await service.validateToken(mockToken);
      expect(result).toEqual(mockResponse.data);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${process.env.AUTH_SERVICES_URL}/auth/validate-token`,
        { headers: { Authorization: `Bearer mock-token` } },
      );
    });

    it('should return undefined if validation fails', async () => {
      const mockToken = 'Bearer invalid-token';
      mockHttpService.get.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await service.validateToken(mockToken);
      expect(result).toBeUndefined();
    });
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO ,
        dueDate: new Date(),
      };

      const mockTask = {
        id: 1,
        ...createTaskDto,
      };

      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.createTask(createTaskDto);
      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.save).toHaveBeenCalledWith(expect.objectContaining(createTaskDto));
    });
  });
});

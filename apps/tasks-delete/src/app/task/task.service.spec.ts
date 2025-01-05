import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

describe('TaskService', () => {
  let service: TaskService;
  let tasksRepository: jest.Mocked<Repository<Task>>;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const mockTasksRepository = {
      delete: jest.fn(),
    };

    const mockHttpService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTasksRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    tasksRepository = module.get(getRepositoryToken(Task));
    httpService = module.get(HttpService);
  });

  describe('validateToken', () => {
    it('should return user data if the token is valid', async () => {
      const mockToken = 'Bearer validToken';
      const mockResponse: AxiosResponse = {
        data: { id: '1', email: 'user@example.com' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      httpService.get.mockReturnValue(of(mockResponse));

      const result = await service.validateToken(mockToken);

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.AUTH_SERVICES_URL}/auth/validate-token`,
        { headers: { Authorization: `Bearer validToken` } },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors gracefully and return undefined', async () => {
      const mockToken = 'Bearer invalidToken';

      httpService.get.mockReturnValue(
        throwError(() => new Error('Invalid token')),
      );

      const result = await service.validateToken(mockToken);

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.AUTH_SERVICES_URL}/auth/validate-token`,
        { headers: { Authorization: `Bearer invalidToken` } },
      );
      expect(result).toBeUndefined();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const taskId = 1;
  
      tasksRepository.delete.mockResolvedValue(undefined);
  
      await service.deleteTask(taskId);
  
      expect(tasksRepository.delete).toHaveBeenCalledWith(taskId);
    });
  
    it('should handle errors when deleting a task', async () => {
      const taskId = 1
  
      tasksRepository.delete.mockRejectedValue(new Error('Delete failed'));
  
      try {
        await service.deleteTask(taskId);
      } catch (error) {
        expect(tasksRepository.delete).toHaveBeenCalledWith(taskId);
        expect(error.message).toBe('Delete failed');
      }
    });
  });
  
});

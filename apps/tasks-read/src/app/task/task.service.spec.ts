import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { of, throwError } from 'rxjs';
import { AxiosHeaders } from 'axios'; 

describe('TaskService', () => {
    let service: TaskService;
    let taskRepository: Repository<Task>;
    let httpService: HttpService;
  
    const mockTaskRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
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
      taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
      httpService = module.get<HttpService>(HttpService);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    describe('getTasks', () => {
      it('should return a list of tasks', async () => {
        
        const tasksArray = [
          {
            id: 1,
            title: 'Test Task',
            description: 'Description of the task',
            status: 'in_progress',
            dueDate: new Date('2025-01-01'),
          },
          {
            id: 2,
            title: 'Another Task',
            description: 'Another task description',
            status: 'completed',
            dueDate: new Date('2025-02-01'),
          },
        ];
  
        jest.spyOn(taskRepository, 'find').mockResolvedValue(tasksArray);
  
        const result = await service.getTasks();
        expect(result).toEqual(tasksArray);
      });
    });
  
    describe('getTaskById', () => {
      it('should return a task by id', async () => {
        
        const mockTask = {
          id: 1,
          title: 'Test Task',
          description: 'Task description',
          status: 'in_progress',
          dueDate: new Date('2025-01-01'),
        };
        jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockTask);
  
        const result = await service.getTaskById(1);
        expect(result).toEqual(mockTask);
      });
  
      it('should return undefined if task is not found', async () => {
        jest.spyOn(taskRepository, 'findOne').mockResolvedValue(undefined);
  
        const result = await service.getTaskById(1);
        expect(result).toBeUndefined();
      });
    });
  });
  

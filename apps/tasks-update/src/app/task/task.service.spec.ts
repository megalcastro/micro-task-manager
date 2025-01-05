import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let httpService: HttpService;

  const mockTaskRepository = {
    findOne: jest.fn(),
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
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateTask', () => {
    it('should update a task if it exists', async () => {
      const mockTask = { id: 1, title: 'Test Task', description: 'Test Description', status: 'TODO', dueDate: new Date() };
      const updatedTask = { ...mockTask, title: 'Updated Task', description: 'Updated Description' };

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(updatedTask);

      const result = await service.updateTask(1, 'Updated Task', 'Updated Description', 'IN_PROGRESS', new Date());
      expect(result).toEqual(updatedTask);
    });

    it('should throw an error if the task does not exist', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      try {
        await service.updateTask(1, 'Updated Task', 'Updated Description', 'IN_PROGRESS', new Date());
      } catch (error) {
        expect(error.message).toBe('Task not found');
      }
    });
  });
});

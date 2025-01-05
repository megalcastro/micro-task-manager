import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateToken', () => {
    it('should return decoded token if valid', async () => {
      const mockToken = 'valid.token';
      const decodedToken = { email: 'test@example.com', sub: 1 };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

      const result = await service.validateToken(mockToken);

      expect(jwtService.verify).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(decodedToken);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const mockToken = 'invalid.token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken(mockToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
        role:'user'
      };
      const mockPassword = 'password';
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, mockPassword);

      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.password);
      expect(result).toEqual({ id: mockUser.id, email: mockUser.email , role: mockUser.role,});
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'jwt.token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(result).toEqual({ access_token: mockToken });
    });
  });
});

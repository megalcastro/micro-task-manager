import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockToken = { access_token: 'mockToken' };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await authController.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password');
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockToken);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockAuthService.validateUser.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(
        authController.login({ email: 'test@example.com', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateToken', () => {
    it('should return user data if the token is valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      mockAuthService.validateToken.mockResolvedValue(mockUser);

      const result = await authController.validateToken('Bearer validToken');

      expect(authService.validateToken).toHaveBeenCalledWith('validToken');
      expect(result).toEqual({ valid: true, user: mockUser });
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      await expect(authController.validateToken('')).rejects.toThrow(
        new UnauthorizedException('Token is required'),
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockAuthService.validateToken.mockRejectedValue(new UnauthorizedException('Invalid token'));

      await expect(authController.validateToken('Bearer invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

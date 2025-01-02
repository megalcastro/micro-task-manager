import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; role?: string }) {
    const { email, password, role } = body;
    return this.usersService.register(email, password, role || 'user');
  }

  @Get()
  async getAllUsers() {
    return { message: 'Endpoint para listar usuarios, implementarlo según necesidades' };
  }
}

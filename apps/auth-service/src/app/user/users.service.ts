import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(email: string, password: string, role: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersRepository.createUser(email, hashedPassword, role);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async validatePassword(email: string, plainPassword: string) {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(plainPassword, user.password))) {
      return user;
    }
    return null;
  }
}

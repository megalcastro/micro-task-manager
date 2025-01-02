import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async createUser(email: string, password: string, role = 'user'): Promise<User> {
    const user = this.repository.create({ email, password, role });
    return await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.repository.findOne({ where: { email } });
  }
}

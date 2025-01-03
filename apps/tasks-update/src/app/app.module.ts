import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [TaskModule,
    ConfigModule.forRoot(),
    HttpModule.register({
    baseURL: process.env.AUTH_SERVICES_URL,
    timeout: 6000,
    headers: {
      'Content-Type': 'application/json',
    },
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
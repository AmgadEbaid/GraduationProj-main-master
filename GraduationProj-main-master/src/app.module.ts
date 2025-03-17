import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/User';
import { Otp } from 'entities/Otp';
import { APP_PIPE } from '@nestjs/core';


@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, Otp],
  }),UserModule, AuthModule],
  controllers: [AppController],
  providers: [ {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
    }),
  },AppService],
})
export class AppModule {}

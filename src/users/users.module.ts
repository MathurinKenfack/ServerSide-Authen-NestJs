import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UserEntity } from './types/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: 'USERS_SERVICE',
      useClass: UsersService,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}

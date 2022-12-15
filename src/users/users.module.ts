import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { User } from './types/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users/users.controller';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [
		{
			provide: 'USERS_SERVICE',
			useClass: UsersService,
		},
	],
	controllers: [UsersController],
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('users');
	}
}

import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/services/users/users.service';
import { User } from '../../typeorm';

export class JwtSerializer extends PassportSerializer {
	constructor(
		@Inject('USERS_SERVICE')
		private readonly usersService: UsersService,
	) {
		super();
	}

	serializeUser(user: User, done: (err, user: User) => void) {
		console.log('Serialized User');
		done(null, user);
	}

	async deserializeUser(user: User, done: (err, user: User) => void) {
		console.log('Deserialize User');
		const userDB = await this.usersService.getUserById(user.id);

		return userDB ? done(null, userDB) : done(null, null);
	}
}

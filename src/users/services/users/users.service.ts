import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { encodePassword } from '../../../utils/bcrypt';
import { SerializedUser } from '../../types/User.serialized';
import { CreateGoogleUserDto } from '../../dto/CreateGoogleUser.dto';
import { capitalizeWord } from '../../../utils/helpers';
import { UpdateUserDto } from '../../dto/UpdateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../../mail/services/mail/mail.service';
import { SendUserMailDto } from 'src/users/dto/sendUserMail.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private jwtService: JwtService,
		private mailService: MailService,
	) {}
	private readonly logger = new Logger(UsersService.name);

	async getAllUsers() {
		this.logger.log({ report: 'Get all Users.' }, this.getAllUsers.name);
		return this.usersRepository.find().then((users) => {
			if (users.length === 0) {
				this.logger.log(
					{ report: 'No User Found.' },
					this.getAllUsers.name,
				);
				return [];
			}
			this.logger.log(
				{ report: 'User(s) found.' },
				this.getAllUsers.name,
			);
			return users.map((user) => new SerializedUser(user));
		});
	}

	async getUserById(id: number) {
		this.logger.log({ id: id }, this.getUserById.name);
		const user = await this.usersRepository.findOneBy({ id: id });
		if (user?.id) {
			this.logger.log(
				{ id: id, report: 'User found.' },
				this.getUserById.name,
			);
			return user;
		}
		this.logger.log(
			{ id: id, report: 'User not found.' },
			this.getUserById.name,
		);
		return null;
	}

	async getUserByEmail(email: string) {
		this.logger.log({ email: email }, this.getUserByEmail.name);
		const user = await this.usersRepository.findOneBy({ email: email });
		if (user?.id) {
			this.logger.log(
				{ email: email, report: 'User found.' },
				this.getUserByEmail.name,
			);
			return user;
		}
		this.logger.log(
			{ email: email, report: 'User not found.' },
			this.getUserByEmail.name,
		);
		return null;
	}

	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		this.logger.log({ id: id }, this.updateUser.name);
		const updateResult = await this.usersRepository.update(
			{ id: id },
			updateUserDto,
		);
		return updateResult;
	}

	async createUser(user: CreateUserDto) {
		const { password, email, ...customizedUser } = user;
		this.logger.log(
			{ user: customizedUser, report: 'Encoding the password.' },
			this.createUser.name,
		);
		const passwordHashed = encodePassword(user.password);
		this.logger.log(
			{ user: customizedUser, report: 'Password encoded successfully.' },
			this.createUser.name,
		);
		this.logger.log(
			{ user: customizedUser, report: 'Creating the user...' },
			this.createUser.name,
		);
		const newUser = this.usersRepository.create({
			...user,
			firstName: capitalizeWord(user.firstName),
			lastName: capitalizeWord(user.lastName),
			password: passwordHashed,
			refreshToken: null,
			lastLogin: null,
		});
		this.logger.log(
			{
				user: customizedUser,
				report: 'Saving the created user in DB...',
			},
			this.createUser.name,
		);
		const savedUser = await this.usersRepository.save(newUser);
		this.logger.log(
			{
				user: customizedUser,
				report: 'Created User successfully saved.',
			},
			this.createUser.name,
		);
		return new SerializedUser(savedUser);
	}

	async createGoogleUser(user: CreateGoogleUserDto) {
		const { password, email, ...customizedUser } = new SerializedUser(user);
		this.logger.log(
			{ user: customizedUser, report: 'Creating the user...' },
			this.createGoogleUser.name,
		);
		const user_2 = await this.usersRepository.save({
			...user,
			firstName: capitalizeWord(user.firstName),
			lastName: capitalizeWord(user.lastName),
			refreshToken: null,
			active: true,
			lastLogin: null,
		});
		this.logger.log(
			{
				user: customizedUser,
				report: 'Created User successfully saved.',
			},
			this.createGoogleUser.name,
		);
		return new SerializedUser(user_2);
	}

	async sendMailConfirmation(user: SendUserMailDto) {
		this.logger.log(
			{
				user: user,
				report: 'creating the confirm email token...',
			},
			this.sendMailConfirmation.name,
		);

		const token = await this.jwtService.signAsync(
			{ id: user.id },
			{ secret: process.env.CONFIRMATION_EMAIL_SECRET },
		);
		this.logger.log(
			{ user: user, report: 'Confirm email token created.' },
			this.sendMailConfirmation.name,
		);
		this.logger.log(
			{ user: user, report: 'Sending the mail...' },
			this.sendMailConfirmation.name,
		);
		await this.mailService.sendUserEmailConfirmation(user, token);
	}
}

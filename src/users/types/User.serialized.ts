import { Exclude } from 'class-transformer';

export class SerializedUser {
	@Exclude()
	id: number;

	firstName: string;

	lastName: string;

	email: string;

	@Exclude()
	password: string;

	@Exclude()
	refreshToken: string;

	@Exclude()
	lastLogin: Date | null;

	constructor(partial: Partial<SerializedUser>) {
		Object.assign(this, partial);
	}
}

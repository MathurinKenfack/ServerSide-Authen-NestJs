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

	@Exclude()
	active: boolean;

	constructor(partial: Partial<SerializedUser>) {
		Object.assign(this, partial);
	}
}

export interface UserI {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	lastLogin: Date | null;
	active: boolean;
}

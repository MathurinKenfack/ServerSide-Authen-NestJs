import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'first_name' })
	firstName: string;

	@Column({ name: 'last_name' })
	lastName: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	password: string | null;

	@Column({ nullable: true })
	refreshToken: string | null;

	@Column({ name: 'last_login', nullable: true, type: 'timestamptz' })
	lastLogin: Date | null;

	@Column({ default: false })
	active: boolean;
}

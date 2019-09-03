import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public email: string;

    @Column({ type: 'varchar', nullable: true })
    public passwordHash: string | null = null;

    @Column({ type: 'datetime', nullable: true })
    public passwordHashCreationDate: Date | null = null;

    @Column({ type: 'varchar', nullable: true })
    public passwordToken: string | null = null;

    @Column({ type: 'datetime', nullable: true })
    public passwordTokenCreationDate: Date | null = null;

    @Column('simple-array')
    public roles: string[] = [];
}

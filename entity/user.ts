import { Column, Entity, ObjectID, PrimaryGeneratedColumn } from 'typeorm';

// https://github.com/typeorm/typeorm/blob/master/docs/entity-inheritance.md
@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    public id: ObjectID;

    @Column()
    public email: string;

    @Column({ nullable: true })
    public passwordHash?: string;

    @Column({ nullable: true })
    public passwordHashCreationDate?: Date;

    @Column({ nullable: true })
    public passwordToken?: string;

    @Column({ nullable: true })
    public passwordTokenCreationDate?: Date;

    @Column('simple-array')
    public roles: string[] = [];
}

import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

// https://github.com/typeorm/typeorm/blob/master/docs/entity-inheritance.md
@Entity()
export class User {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public email: string;

    @Column()
    public passwordHash: string;

    @Column()
    public passwordHashCreationDate: Date;

    @Column()
    public passwordToken?: string;

    @Column()
    public passwordTokenCreationDate?: Date;

    @Column()
    public roles: string[] = [];
}

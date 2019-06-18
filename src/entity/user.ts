import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public email: string;

    @Column()
    public password: string;
}

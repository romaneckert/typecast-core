import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Log {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public code: number;

    @Column()
    public message: string;
}

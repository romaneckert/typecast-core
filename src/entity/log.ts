import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Log {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    code: number;

    @Column()
    message: string;
}

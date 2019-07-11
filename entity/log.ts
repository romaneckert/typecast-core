import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

// https://github.com/typeorm/typeorm/blob/master/docs/entity-inheritance.md
@Entity()
export class Log {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public code: number;

    @Column()
    public date: Date;

    @Column()
    public message: string;

    @Column()
    public contextType: string;

    @Column()
    public contextName: string;

    @Column()
    public data: string = '';

    constructor(code: number, date: Date, contextType: string, contextName: string, message: string, data?: string) {
        this.code = code;
        this.date = date;
        this.contextType = contextType;
        this.contextName = contextName;
        this.message = message;

        if (undefined !== data) {
            this.data = data;
        }
    }

    public get level(): string {
        switch (this.code) {
            case 0:
                return 'emergency';
            case 1:
                return 'alert';
            case 2:
                return 'critical';
            case 3:
                return 'error';
            case 4:
                return 'warning';
            case 5:
                return 'notice';
            case 6:
                return 'info';
            default:
                return 'debug';
        }
    }
}

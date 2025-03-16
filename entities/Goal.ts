import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";

@Entity("goals")
export class Goal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    user: User;
    @Column()
    value: number;
    @Column()
    goal_name: string;
    @Column()
    date: Date;
}

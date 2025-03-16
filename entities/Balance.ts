import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "./User";
import {Category} from "./Category";
import {Type} from "./Type";

@Entity("balances")
export class Balance {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    user: User;
    @ManyToOne(() => Category, (category) => category.id, { onDelete: "CASCADE" })
    category: Category;
    @ManyToOne(() => Type, (type) => type.id, { onDelete: "CASCADE" })
    type: Type;
    @Column()
    date: Date;
    @Column()
    value: number;
    @Column()
    comment: string;
    @Column()
    planned: number;
}
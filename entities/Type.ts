import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("types")
export class Type {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}

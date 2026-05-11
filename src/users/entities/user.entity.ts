import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from "typeorm";
import {Role} from "../../roles/entitites/roles.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column({ unique: true , nullable: false})
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    phone: string;

    @Column({default: true})
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable({name: 'user_roles'})
    roles: Role[];
}

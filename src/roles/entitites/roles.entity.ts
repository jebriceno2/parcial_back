import {Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../../users/entities/user.entity";
@Entity('roles') 
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    role_name: string;

    @Column({nullable: true})
    description: string;

    @CreateDateColumn()
    created_at: Date;
    
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
}

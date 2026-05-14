import {Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../../users/entities/user.entity";


@Entity('appointmente')
export class Appointmente { 
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    date: Date;

    @Column()
    reason: string;

    @Column({default: 'pending', enum: ['pending', 'done', 'cancelled']})
    status: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'patient_id' })
    patient: User;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'doctor_id' })
    doctor: User;
  


}

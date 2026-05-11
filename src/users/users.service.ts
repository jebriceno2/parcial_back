import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { Role } from 'src/roles/entitites/roles.entity';


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User)
        private readonly UserRepo: Repository<User>,
        @InjectRepository(Role)
        private readonly rolesRepo: Repository<Role>,
    ){}

    findByEmail(email: string){
        return this.UserRepo.findOne({ where: {email}});
    }

    findById(id: string){
        return this.UserRepo.findOne({where: {id}});
    }

    create(data: Partial<User>){
        const user = this.UserRepo.create(data);
        return this.UserRepo.save(user);
    }
    async getProfile(userId: string){
        const user = await this.UserRepo.findOne({where: {id: userId}, relations: ['roles']});
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return {id: user.id, email: user.email, name: user.name, phone: user.phone, roles: user.roles.map(r => r.role_name)};
    }

    async findAll(){
        const users = await this.UserRepo.find();
        return users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            roles: u.roles.map(r => r.role_name),
        }));
    }

    async assignRoles(id: string, roleNames: string[]) {
        const user= await this.UserRepo.findOne({where: {id}});
        if(!user) throw new NotFoundException('Usuario no encontrado');
        const roles = await this.rolesRepo.find({ where: { role_name: In(roleNames) } });
        if ( roles.length !== roleNames.length){throw new BadRequestException('Alguno de los roles no existe');}
        user.roles = roles;
        await this.UserRepo.save(user);
        return { message: 'Roles asignados' };
    }
    
}

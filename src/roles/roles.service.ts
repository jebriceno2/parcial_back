import { Injectable, ConflictException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Role} from './entitites/roles.entity'
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role)
        private readonly rolesRepo: Repository<Role>,
    ){}


    async create(dto: CreateRoleDto)
    {
        const existe = await this.rolesRepo.findOne({
            where: { role_name: dto.role_name},
        });
        if (existe) {
            throw new ConflictException('role_name ya existe');
        }
        const rol = this.rolesRepo.create(dto);
        const saved = await this.rolesRepo.save(rol);

        return { message: 'Rol creado con exito', roleId: saved.id}

    }
    async findAll() {
        return this.rolesRepo.find({
            select: ['id', 'role_name', 'description'],
        });
    }
}
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// @UseGuards a nivel de clase → TODOS los endpoints requieren JWT válido +
// chequeo de roles. El orden importa: primero JwtAuthGuard (mete req.user),
// luego RolesGuard (lee req.user y compara con la metadata @Roles).
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Solo admins pueden crear roles → 403 si no es admin
  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  // Solo admins pueden listar roles
  @Get()
  @Roles('admin')
  async findAll() {
    return this.rolesService.findAll();
  }
}

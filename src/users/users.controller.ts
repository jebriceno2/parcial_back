import { Controller, Get, Post, Body, UseGuards, Req, Patch, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { ParseUUIDPipe } from '@nestjs/common';



// @UseGuards a nivel de clase → TODOS los endpoints requieren JWT válido +
// chequeo de roles. El orden importa: primero JwtAuthGuard (mete req.user),
// luego RolesGuard (lee req.user y compara con la metadata @Roles).
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    // Solo admins pueden crear usuarios → 403 si no es admin
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@Req() req) {
        const userId = req.user.id
        return this.usersService.getProfile(userId);
    }

    @Get()
    @Roles('admin')
    async findAll() {
        return this.usersService.findAll();
    }

    @Patch(':id/roles')
    @Roles('admin')
    async assignRoles(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignRolesDto) {
        return this.usersService.assignRoles(id, dto.roles);
        

    }
}

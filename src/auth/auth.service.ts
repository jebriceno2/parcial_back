import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { Role } from '../roles/entitites/roles.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Role)
    private readonly rolesRepo: Repository<Role>,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Email único
    const existe = await this.usersService.findByEmail(dto.email);
    if (existe) {
      throw new ConflictException('Email ya registrado');
    }

    // 2. Hash de contraseña (10 saltRounds)
    const hash = await bcrypt.hash(dto.password, 10);

    // 3. Resolver roles si vienen en el body (nombres → entidades Role)
    let roles: Role[] = [];
    if (dto.roles && dto.roles.length > 0) {
      roles = await this.rolesRepo.find({
        where: { role_name: In(dto.roles) },
      });
    }

    // 4. Crear usuario
    const user = await this.usersService.create({
      email: dto.email,
      password: hash,
      name: dto.name,
      phone: dto.phone,
      roles,
    });

    // 5. Respuesta exacta del PDF
    return { message: 'Usuario registrado con éxito', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // No revelamos si el email existe o no → siempre "Credenciales incorrectas"
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 423 Locked si está desactivado (después de confirmar que el user existe)
    if (!user.is_active) {
      throw new HttpException('Usuario desactivado', HttpStatus.LOCKED);
    }

    // Comparar password contra el hash guardado
    const valido = await bcrypt.compare(dto.password, user.password);
    if (!valido) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Payload del JWT: lo mínimo que necesitamos en cada request
    const payload = {
      sub: user.id, // "sub" = subject (id del usuario, estándar JWT)
      email: user.email,
      roles: user.roles.map((r) => r.role_name),
    };

    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}

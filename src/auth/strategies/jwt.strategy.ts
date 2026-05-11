import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service';

// Tipo del payload que metimos al firmar el token en AuthService.login()
interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // De dónde sacar el token: del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Si el token expiró (más de JWT_EXPIRES_IN), 401 automático
      ignoreExpiration: false,
      // Secret para VERIFICAR la firma (debe ser el mismo con el que firmamos)
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  // Passport llama validate() DESPUÉS de verificar la firma del token.
  // Lo que retornemos aquí queda disponible como request.user
  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    // Si el usuario fue eliminado o desactivado después de emitir el token, 401
    if (!user || !user.is_active) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map((r) => r.role_name),
    };
  }
}

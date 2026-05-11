import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtAuthGuard = un alias amigable de AuthGuard('jwt').
// 'jwt' es el nombre por defecto de la estrategia JwtStrategy (passport-jwt).
// Al usarlo, Passport ejecuta JwtStrategy.validate() y, si todo OK, mete el
// usuario en request.user. Si no hay token o es inválido → 401 automático.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { Role } from '../roles/entitites/roles.entity';

@Module({
  imports: [
    UsersModule, // exporta UsersService → AuthService lo puede inyectar
    PassportModule, // base de Passport para que JwtStrategy funcione
    TypeOrmModule.forFeature([Role]), // necesitamos Repository<Role> en AuthService

    // JwtModule.registerAsync: lee el secret y expiración del .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          // cast a any porque @nestjs/jwt v11 tipa expiresIn como un template
          // literal estricto y rechaza string plano del ConfigService
          expiresIn: config.get<string>('JWT_EXPIRES_IN') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // Exportamos JwtStrategy y PassportModule para que otros módulos puedan
  // usar AuthGuard('jwt') en sus endpoints protegidos (etapas 5 y 6).
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}

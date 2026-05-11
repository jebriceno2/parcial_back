import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector: utilidad de Nest para LEER la metadata que puso @Roles()
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Leer la metadata de roles del HANDLER (método) y la CLASE (controlador).
    //    getAllAndOverride busca primero en el handler; si no hay, en la clase.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si el endpoint no tiene @Roles(...), no hay restricción → pasa.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. Sacar el usuario que metió JwtAuthGuard (vía request.user).
    const request = context.switchToHttp().getRequest();
    const user = request.user as { roles?: string[] } | undefined;

    if (!user || !user.roles) {
      throw new ForbiddenException('No autorizado');
    }

    // 4. ¿El usuario tiene al menos UNO de los roles requeridos?
    const tienePermiso = user.roles.some((rol) => requiredRoles.includes(rol));

    if (!tienePermiso) {
      throw new ForbiddenException('No autorizado');
    }

    return true;
  }
}

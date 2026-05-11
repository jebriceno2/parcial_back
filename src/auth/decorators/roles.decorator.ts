import { SetMetadata } from '@nestjs/common';

// Llave con la que guardamos/recuperamos la metadata de roles.
// El RolesGuard usa esta misma llave con Reflector.get(...) para leerla.
export const ROLES_KEY = 'roles';

// @Roles('admin' → guarda ['admin'] como metadata del método.
// Uso: @Roles('admin') sobre cualquier endpoint que solo admins pueden tocar.
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

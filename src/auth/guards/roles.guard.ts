import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Role } from 'src/admins/enum/admin-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    // If user is admin or super admin, allow access to all routes
    if (user.role === Role.Admin || user.role === Role.SuperAdmin) {
      return true;
    }

    // If no roles are specified, only admins can access (default behavior)
    if (!requiredRoles) {
      return false;
    }

    // For regular users, check if their role is in the required roles
    return requiredRoles.includes(user.role);
  }
}

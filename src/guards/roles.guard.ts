import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // If there's no user, deny access
    if (!user) {
      return false;
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => {
      const userRoleStr = String(user.role);
      const requiredRoleStr = String(role);
      const match = userRoleStr === requiredRoleStr;      
      return match;
    });
    
    return hasRole;
  }
}

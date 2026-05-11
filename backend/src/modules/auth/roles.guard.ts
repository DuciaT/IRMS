import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Logger,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Request } from 'express';
  
  /**
   * 🔐 RolesGuard - Kiểm tra quyền hạn Role (CSR, ADMIN, etc)
   * - Dùng @Roles decorator trên endpoint
   * - Chỉ user có role được phép mới có quyền gọi API
   */
  @Injectable()
  export class RolesGuard implements CanActivate {
    private logger = new Logger('RolesGuard');
  
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
  
      // Nếu endpoint không có @Roles, bỏ qua check
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const userRole = request.user?.role;
  
      if (!userRole) {
        this.logger.warn('User role not found in request');
        throw new ForbiddenException('User role not found');
      }
  
      const hasRole = requiredRoles.includes(userRole);
      if (!hasRole) {
        this.logger.warn(`❌ Access denied for role ${userRole}. Required: [${requiredRoles.join(', ')}]`);
        throw new ForbiddenException(
          `Role '${userRole}' not allowed. Required: [${requiredRoles.join(', ')}]`,
        );
      }
  
      this.logger.log(`✅ Role check passed: ${userRole} for [${requiredRoles.join(', ')}]`);
      return true;
    }
  }
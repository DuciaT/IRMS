import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
  } from '@nestjs/common';
  import { Request } from 'express';
  
  /**
   * 🔐 AuthGuard - Xác thực JWT Token cho CSR
   * - Kiểm tra token có hợp lệ không
   * - Decode CSR info (id, name, role) từ token
   * - Lưu vào request.user để controller sử dụng
   */
  @Injectable()
  export class AuthGuard implements CanActivate {
    private logger = new Logger('AuthGuard');
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
  
      if (!token) {
        this.logger.warn('Missing authorization token');
        throw new UnauthorizedException('Missing token');
      }
  
      try {
        // ✅ TƯƠNG LAI: Thay bằng JWT verify thực tế
        // Hiện tại hardcode để test
        const csrInfo = this.mockVerifyToken(token);
        request.user = csrInfo;
        request.csrId = csrInfo.id;
        request.csrName = csrInfo.name;
  
        this.logger.log(`✅ Auth success for CSR: ${csrInfo.name} (${csrInfo.id})`);
        return true;
      } catch (error) {
        this.logger.error(`❌ Token verification failed: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }
    }
  
    private extractToken(request: Request): string | null {
      const authHeader = request.headers['authorization'];
      if (!authHeader) return null;
  
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
      return parts[1];
    }
  
    /**
     * 🔧 Mock token verification - thay thế bằng JWT verify thực tế
     * TODO: Replace with real JWT verification
     */
    private mockVerifyToken(token: string) {
      // Hardcode để test - tương lai dùng JWT.verify()
      const mockTokens: Record<string, any> = {
        'csr-token-001': {
          id: 'csr-001',
          name: 'Hoa',
          role: 'CSR',
          restaurantId: 'rest-001',
        },
        'csr-token-002': {
          id: 'csr-002',
          name: 'Minh',
          role: 'CSR',
          restaurantId: 'rest-001',
        },
        'admin-token-001': {
          id: 'admin-001',
          name: 'Quản lý',
          role: 'ADMIN',
          restaurantId: 'rest-001',
        },
      };
  
      const user = mockTokens[token];
      if (!user) {
        throw new Error('Token not recognized');
      }
  
      return user;
    }
  }
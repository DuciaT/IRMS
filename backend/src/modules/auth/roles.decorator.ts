import { SetMetadata } from '@nestjs/common';

/**
 * 🏷️ @Roles Decorator - Đánh dấu endpoint yêu cầu role nào
 * Sử dụng:
 *   @Roles('CSR', 'ADMIN')
 *   async createOrder(...) { }
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
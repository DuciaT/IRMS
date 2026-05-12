import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditActor } from '../audit/audit-log.entity';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UserRole } from './user-role.enum';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('staff')
  listStaff(@Query('includeTerminated') includeTerminated?: string) {
    return this.userService.listStaff(includeTerminated === 'true');
  }

  @Get('staff/:id')
  getStaff(@Param('id') id: string) {
    return this.userService.getStaffById(id);
  }

  @Post('staff')
  createStaff(
    @Body() dto: CreateStaffDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userService.createStaff(dto, this.toAuditActor(user));
  }

  @Patch('staff/:id')
  updateStaff(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userService.updateStaff(id, dto, this.toAuditActor(user));
  }

  @Patch('staff/:id/lock')
  lockStaff(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.userService.lockStaff(id, this.toAuditActor(user));
  }

  @Patch('staff/:id/activate')
  activateStaff(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.userService.activateStaff(id, this.toAuditActor(user));
  }

  @Delete('staff/:id')
  deleteStaff(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.userService.deleteStaff(id, this.toAuditActor(user));
  }

  private toAuditActor(user: AuthenticatedUser): AuditActor {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}

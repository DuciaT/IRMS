import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';
import { AuditActor } from '../audit/audit-log.entity';
import { AuditService } from '../audit/audit.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { SafeUserAccount, UserAccount } from './entities/user-account.entity';
import { StaffStatus } from './staff-status.enum';
import { isStaffRole, StaffRole, UserRole } from './user-role.enum';

@Injectable()
export class UserService {
  private readonly users = new Map<string, UserAccount>();
  private employeeSequence = 1;

  constructor(private readonly auditService: AuditService) {
    this.seedUsers();
  }

  listStaff(includeTerminated = false): SafeUserAccount[] {
    return [...this.users.values()]
      .filter((user) => isStaffRole(user.role))
      .filter(
        (user) => includeTerminated || user.status !== StaffStatus.TERMINATED,
      )
      .map((user) => this.toSafeUser(user));
  }

  getStaffById(id: string): SafeUserAccount {
    return this.toSafeUser(this.getStaffEntity(id));
  }

  createStaff(dto: CreateStaffDto, actor: AuditActor): SafeUserAccount {
    const now = new Date().toISOString();
    const role = this.parseStaffRole(dto.role);
    const email = this.normalizeEmail(dto.email);
    const employeeCode =
      this.normalizeOptional(dto.employeeCode) ?? this.nextEmployeeCode();

    this.assertRequired(dto.fullName, 'fullName');
    this.assertUniqueEmail(email);
    this.assertUniqueEmployeeCode(employeeCode);
    this.assertPasswordStrength(dto.password);

    const user: UserAccount = {
      id: randomUUID(),
      employeeCode,
      fullName: dto.fullName.trim(),
      email,
      passwordHash: this.hashPassword(dto.password),
      role,
      status: StaffStatus.ACTIVE,
      phone: this.normalizeOptional(dto.phone),
      position: this.normalizeOptional(dto.position),
      createdAt: now,
      updatedAt: now,
      createdBy: actor.id,
    };

    this.users.set(user.id, user);
    this.auditService.record({
      action: 'STAFF_CREATED',
      actor,
      targetType: 'USER',
      targetId: user.id,
      targetEmail: user.email,
      metadata: { role: user.role, employeeCode: user.employeeCode },
    });

    return this.toSafeUser(user);
  }

  updateStaff(
    id: string,
    dto: UpdateStaffDto,
    actor: AuditActor,
  ): SafeUserAccount {
    const user = this.getStaffEntity(id);

    if (user.status === StaffStatus.TERMINATED) {
      throw new BadRequestException(
        'Terminated staff accounts cannot be updated.',
      );
    }

    const before = this.toSafeUser(user);

    if (dto.fullName !== undefined) {
      this.assertRequired(dto.fullName, 'fullName');
      user.fullName = dto.fullName.trim();
    }

    if (dto.email !== undefined) {
      const email = this.normalizeEmail(dto.email);
      this.assertUniqueEmail(email, user.id);
      user.email = email;
    }

    if (dto.employeeCode !== undefined) {
      const employeeCode = this.normalizeOptional(dto.employeeCode);
      if (!employeeCode) {
        throw new BadRequestException('employeeCode cannot be empty.');
      }
      this.assertUniqueEmployeeCode(employeeCode, user.id);
      user.employeeCode = employeeCode;
    }

    if (dto.password !== undefined) {
      this.assertPasswordStrength(dto.password);
      user.passwordHash = this.hashPassword(dto.password);
    }

    if (dto.role !== undefined) {
      user.role = this.parseStaffRole(dto.role);
    }

    if (dto.phone !== undefined) {
      user.phone = this.normalizeOptional(dto.phone);
    }

    if (dto.position !== undefined) {
      user.position = this.normalizeOptional(dto.position);
    }

    user.updatedAt = new Date().toISOString();
    user.updatedBy = actor.id;

    this.auditService.record({
      action: 'STAFF_UPDATED',
      actor,
      targetType: 'USER',
      targetId: user.id,
      targetEmail: user.email,
      metadata: { before, after: this.toSafeUser(user) },
    });

    return this.toSafeUser(user);
  }

  lockStaff(id: string, actor: AuditActor): SafeUserAccount {
    const user = this.getStaffEntity(id);
    this.assertNotTerminated(user);

    user.status = StaffStatus.LOCKED;
    user.updatedAt = new Date().toISOString();
    user.updatedBy = actor.id;

    this.auditService.record({
      action: 'STAFF_LOCKED',
      actor,
      targetType: 'USER',
      targetId: user.id,
      targetEmail: user.email,
    });

    return this.toSafeUser(user);
  }

  activateStaff(id: string, actor: AuditActor): SafeUserAccount {
    const user = this.getStaffEntity(id);
    this.assertNotTerminated(user);

    user.status = StaffStatus.ACTIVE;
    user.updatedAt = new Date().toISOString();
    user.updatedBy = actor.id;

    this.auditService.record({
      action: 'STAFF_ACTIVATED',
      actor,
      targetType: 'USER',
      targetId: user.id,
      targetEmail: user.email,
    });

    return this.toSafeUser(user);
  }

  deleteStaff(id: string, actor: AuditActor): SafeUserAccount {
    const user = this.getStaffEntity(id);
    this.assertNotTerminated(user);

    const now = new Date().toISOString();
    user.status = StaffStatus.TERMINATED;
    user.deletedAt = now;
    user.updatedAt = now;
    user.updatedBy = actor.id;

    this.auditService.record({
      action: 'STAFF_TERMINATED',
      actor,
      targetType: 'USER',
      targetId: user.id,
      targetEmail: user.email,
      metadata: { employeeCode: user.employeeCode, role: user.role },
    });

    return this.toSafeUser(user);
  }

  verifyCredentials(email: string, password: string): SafeUserAccount {
    const user = this.findByEmail(email);

    if (!user || !this.verifyPassword(password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status === StaffStatus.LOCKED) {
      throw new UnauthorizedException('Account is locked.');
    }

    if (user.status === StaffStatus.TERMINATED) {
      throw new UnauthorizedException('Account has been terminated.');
    }

    return this.toSafeUser(user);
  }

  getAuthenticatedUser(id: string): SafeUserAccount {
    const user = this.users.get(id);

    if (!user || user.status !== StaffStatus.ACTIVE) {
      throw new UnauthorizedException('Authentication is no longer valid.');
    }

    return this.toSafeUser(user);
  }

  recordLogin(id: string): void {
    const user = this.users.get(id);

    if (!user) {
      return;
    }

    user.lastLoginAt = new Date().toISOString();
    user.updatedAt = user.lastLoginAt;
  }

  private getStaffEntity(id: string): UserAccount {
    const user = this.users.get(id);

    if (!user || !isStaffRole(user.role)) {
      throw new NotFoundException('Staff account was not found.');
    }

    return user;
  }

  private findByEmail(email: string): UserAccount | undefined {
    const normalizedEmail = this.normalizeEmail(email);
    return [...this.users.values()].find(
      (user) => user.email === normalizedEmail,
    );
  }

  private parseStaffRole(role: unknown): StaffRole {
    if (!isStaffRole(role)) {
      throw new BadRequestException(
        'role must be one of MANAGER, SERVER, CHEF, CASHIER, HOST.',
      );
    }

    return role;
  }

  private assertRequired(value: unknown, field: string): void {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${field} is required.`);
    }
  }

  private assertPasswordStrength(password: unknown): void {
    if (typeof password !== 'string' || password.length < 8) {
      throw new BadRequestException(
        'password must contain at least 8 characters.',
      );
    }
  }

  private assertUniqueEmail(email: string, currentUserId?: string): void {
    const existing = this.findByEmail(email);

    if (existing && existing.id !== currentUserId) {
      throw new ConflictException('email is already used by another account.');
    }
  }

  private assertUniqueEmployeeCode(
    employeeCode: string,
    currentUserId?: string,
  ): void {
    const existing = [...this.users.values()].find(
      (user) => user.employeeCode === employeeCode,
    );

    if (existing && existing.id !== currentUserId) {
      throw new ConflictException(
        'employeeCode is already used by another account.',
      );
    }
  }

  private assertNotTerminated(user: UserAccount): void {
    if (user.status === StaffStatus.TERMINATED) {
      throw new BadRequestException('Staff account is already terminated.');
    }
  }

  private normalizeEmail(email: unknown): string {
    if (typeof email !== 'string' || email.trim().length === 0) {
      throw new BadRequestException('email is required.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      throw new BadRequestException('email must be a valid email address.');
    }

    return normalizedEmail;
  }

  private normalizeOptional(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('Optional text fields must be strings.');
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private nextEmployeeCode(): string {
    const employeeCode = `STF-${String(this.employeeSequence).padStart(4, '0')}`;
    this.employeeSequence += 1;
    return employeeCode;
  }

  private toSafeUser(user: UserAccount): SafeUserAccount {
    const { passwordHash, ...safeUser } = user;
    void passwordHash;
    return { ...safeUser };
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 32).toString('hex');
    return `scrypt$${salt}$${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [, salt, expectedHash] = storedHash.split('$');

    if (!salt || !expectedHash) {
      return false;
    }

    const actualHash = scryptSync(password, salt, 32);
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    return (
      expectedBuffer.length === actualHash.length &&
      timingSafeEqual(expectedBuffer, actualHash)
    );
  }

  private seedUsers(): void {
    const now = new Date().toISOString();
    const seedAccounts: Array<{
      employeeCode: string;
      fullName: string;
      email: string;
      password: string;
      role: UserRole;
      position: string;
    }> = [
      {
        employeeCode: 'ADM-0001',
        fullName: 'System Administrator',
        email: 'admin@irms.local',
        password: 'Admin@123',
        role: UserRole.ADMIN,
        position: 'System Administrator',
      },
      {
        employeeCode: 'MGR-0001',
        fullName: 'Restaurant Manager',
        email: 'manager@irms.local',
        password: 'Manager@123',
        role: UserRole.MANAGER,
        position: 'Manager',
      },
      {
        employeeCode: 'SRV-0001',
        fullName: 'Sample Server',
        email: 'server@irms.local',
        password: 'Server@123',
        role: UserRole.SERVER,
        position: 'Server',
      },
      {
        employeeCode: 'CHF-0001',
        fullName: 'Sample Chef',
        email: 'chef@irms.local',
        password: 'Chef@123',
        role: UserRole.CHEF,
        position: 'Kitchen Staff',
      },
      {
        employeeCode: 'CSH-0001',
        fullName: 'Sample Cashier',
        email: 'cashier@irms.local',
        password: 'Cashier@123',
        role: UserRole.CASHIER,
        position: 'Cashier',
      },
      {
        employeeCode: 'HST-0001',
        fullName: 'Sample Host',
        email: 'host@irms.local',
        password: 'Host@123',
        role: UserRole.HOST,
        position: 'Host',
      },
    ];

    for (const account of seedAccounts) {
      const user: UserAccount = {
        id: randomUUID(),
        employeeCode: account.employeeCode,
        fullName: account.fullName,
        email: account.email,
        passwordHash: this.hashPassword(account.password),
        role: account.role,
        status: StaffStatus.ACTIVE,
        position: account.position,
        createdAt: now,
        updatedAt: now,
      };

      this.users.set(user.id, user);
    }
  }
}

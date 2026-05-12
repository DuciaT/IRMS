import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { AuditService } from '../audit/audit.service';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';
import { RoleView, getRoleView } from './role-view.config';

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: string;
  user: AuthenticatedUser;
  view: RoleView;
}

export interface CurrentSessionResponse {
  user: AuthenticatedUser;
  view: RoleView;
}

@Injectable()
export class AuthService {
  private readonly tokenSecret =
    process.env.AUTH_TOKEN_SECRET ?? 'irms-local-development-secret';
  private readonly tokenTtlSeconds = Number(
    process.env.AUTH_TOKEN_TTL_SECONDS ?? 60 * 60 * 8,
  );

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly auditService: AuditService,
  ) {}

  login(dto: LoginDto): LoginResponse {
    if (
      !dto ||
      typeof dto.email !== 'string' ||
      typeof dto.password !== 'string'
    ) {
      throw new BadRequestException('email and password are required.');
    }

    try {
      const user = this.userService.verifyCredentials(dto.email, dto.password);
      this.userService.recordLogin(user.id);
      this.auditService.record({
        action: 'AUTH_LOGIN_SUCCEEDED',
        actor: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        targetType: 'USER',
        targetId: user.id,
        targetEmail: user.email,
      });

      const now = Math.floor(Date.now() / 1000);
      const expiresAtSeconds = now + this.tokenTtlSeconds;
      const payload: AccessTokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: now,
        exp: expiresAtSeconds,
      };

      return {
        accessToken: this.signPayload(payload),
        tokenType: 'Bearer',
        expiresAt: new Date(expiresAtSeconds * 1000).toISOString(),
        user,
        view: getRoleView(user.role),
      };
    } catch (error) {
      this.auditService.record({
        action: 'AUTH_LOGIN_FAILED',
        targetType: 'USER',
        targetEmail:
          typeof dto.email === 'string'
            ? dto.email.trim().toLowerCase()
            : undefined,
      });

      throw error;
    }
  }

  getCurrentSession(user: AuthenticatedUser): CurrentSessionResponse {
    return {
      user,
      view: getRoleView(user.role),
    };
  }

  getRoleView(role: UserRole): RoleView {
    return getRoleView(role);
  }

  verifyAccessToken(accessToken: string): AuthenticatedUser {
    const payload = this.readPayload(accessToken);
    const user = this.userService.getAuthenticatedUser(payload.sub);

    if (user.email !== payload.email || user.role !== payload.role) {
      throw new UnauthorizedException('Authentication is no longer valid.');
    }

    return user;
  }

  private signPayload(payload: AccessTokenPayload): string {
    const encodedPayload = Buffer.from(
      JSON.stringify(payload),
      'utf8',
    ).toString('base64url');
    const signature = this.sign(encodedPayload);
    return `${encodedPayload}.${signature}`;
  }

  private readPayload(accessToken: string): AccessTokenPayload {
    const [encodedPayload, signature] = accessToken.split('.');

    if (
      !encodedPayload ||
      !signature ||
      !this.isValidSignature(encodedPayload, signature)
    ) {
      throw new UnauthorizedException('Invalid access token.');
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8'),
    ) as AccessTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (
      !payload.sub ||
      !payload.email ||
      !payload.role ||
      !payload.exp ||
      payload.exp <= now
    ) {
      throw new UnauthorizedException('Access token has expired.');
    }

    return payload;
  }

  private sign(encodedPayload: string): string {
    return createHmac('sha256', this.tokenSecret)
      .update(encodedPayload)
      .digest('base64url');
  }

  private isValidSignature(encodedPayload: string, signature: string): boolean {
    const expectedSignature = Buffer.from(this.sign(encodedPayload));
    const actualSignature = Buffer.from(signature);

    return (
      expectedSignature.length === actualSignature.length &&
      timingSafeEqual(expectedSignature, actualSignature)
    );
  }
}

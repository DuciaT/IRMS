import { UserRole } from '../user/user-role.enum';

export interface AuditActor {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor?: AuditActor;
  targetType: string;
  targetId?: string;
  targetEmail?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

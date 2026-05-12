import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { AuditActor, AuditLogEntry } from './audit-log.entity';

export interface RecordAuditLogInput {
  action: string;
  actor?: AuditActor;
  targetType: string;
  targetId?: string;
  targetEmail?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logs: AuditLogEntry[] = [];

  record(input: RecordAuditLogInput): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: randomUUID(),
      action: input.action,
      actor: input.actor,
      targetType: input.targetType,
      targetId: input.targetId,
      targetEmail: input.targetEmail,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    };

    this.logs.unshift(entry);
    return entry;
  }

  findAll(): AuditLogEntry[] {
    return [...this.logs];
  }
}

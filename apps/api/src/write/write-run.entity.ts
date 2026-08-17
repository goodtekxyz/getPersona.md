import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import type { WriteKind, WriteStatus } from '@getpersona/shared';

export type WriteRunTrace = {
  project?: Record<string, unknown>;
  draft?: Record<string, unknown>;
  judge?: Record<string, unknown>;
  laws?: string[];
  llm?: {
    draftStubbed?: boolean;
    judgeStubbed?: boolean;
    draftLive?: boolean;
    judgeLive?: boolean;
  };
};

@Entity('write_runs')
@Index(['personaId', 'createdAt'])
export class WriteRunEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  @Index()
  personaId!: string;

  @Column({ name: 'actor_user_id', type: 'varchar', length: 128 })
  actorUserId!: string;

  @Column({ type: 'varchar', length: 16 })
  kind!: WriteKind;

  @Column({ type: 'varchar', length: 8 })
  status!: WriteStatus;

  @Column({ type: 'text', nullable: true })
  text!: string | null;

  @Column({ type: 'varchar', length: 256, nullable: true })
  reason!: string | null;

  /** Memory ids from project window — ids only, not dump. */
  @Column({ name: 'memory_used', type: 'jsonb' })
  memoryUsed!: string[];

  @Column({ type: 'jsonb' })
  trace!: WriteRunTrace;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

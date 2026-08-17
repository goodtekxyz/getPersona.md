import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import type { SyncAdapterResult, SyncJobStatus, SyncSourceHandles } from '@getpersona/shared';

@Entity('sync_jobs')
@Index(['personaId', 'createdAt'])
@Index(['actorUserId', 'createdAt'])
export class SyncJobEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  @Index()
  personaId!: string;

  @Column({ name: 'actor_user_id', type: 'varchar', length: 128 })
  actorUserId!: string;

  @Column({ type: 'jsonb' })
  handles!: SyncSourceHandles;

  @Column({ type: 'varchar', length: 16 })
  status!: SyncJobStatus;

  @Column({ type: 'text', nullable: true })
  error!: string | null;

  @Column({ name: 'adapter_results', type: 'jsonb' })
  adapterResults!: SyncAdapterResult[];

  @Column({ name: 'artifact_keys', type: 'jsonb' })
  artifactKeys!: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt!: Date | null;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

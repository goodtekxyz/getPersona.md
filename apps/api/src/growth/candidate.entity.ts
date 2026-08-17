import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import type { CandidateStatus, MemoryKind } from '@getpersona/shared';

@Entity('candidates')
@Index(['personaId', 'status'])
export class CandidateEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  @Index()
  personaId!: string;

  @Column({ name: 'episode_id', type: 'uuid' })
  episodeId!: string;

  @Column({ type: 'varchar', length: 32 })
  kind!: MemoryKind;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status!: CandidateStatus;

  @Column({ name: 'promoted_at', type: 'timestamptz', nullable: true })
  promotedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

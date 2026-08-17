import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import type { MemoryKind } from '@getpersona/shared';

/** Typed long-term memory rows produced only by promote(). */
@Entity('ltm_memories')
@Index(['personaId', 'kind'])
export class LtmMemoryEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  @Index()
  personaId!: string;

  @Column({ name: 'candidate_id', type: 'uuid' })
  candidateId!: string;

  @Column({ type: 'varchar', length: 32 })
  kind!: MemoryKind;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ type: 'text', nullable: true })
  summary!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

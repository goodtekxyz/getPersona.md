import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

export type GrowthAuditAction = 'remember' | 'promote';

@Entity('growth_audits')
@Index(['personaId', 'createdAt'])
export class GrowthAuditEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  @Index()
  personaId!: string;

  @Column({ type: 'varchar', length: 16 })
  action!: GrowthAuditAction;

  @Column({ name: 'actor_user_id', type: 'varchar', length: 128 })
  actorUserId!: string;

  @Column({ type: 'jsonb' })
  detail!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

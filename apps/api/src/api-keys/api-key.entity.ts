import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import type { ApiKeyScope } from '@getpersona/shared';

@Entity('api_keys')
@Index(['ownerUserId'])
@Index(['keyHash'], { unique: true })
export class ApiKeyEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'owner_user_id', type: 'varchar', length: 128 })
  ownerUserId!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  /** sha256 hex of the full plaintext key — never store plaintext. */
  @Column({ name: 'key_hash', type: 'varchar', length: 64 })
  keyHash!: string;

  /** Short prefix for list UI (e.g. gp_live_ab12). */
  @Column({ name: 'key_prefix', type: 'varchar', length: 24 })
  keyPrefix!: string;

  @Column({ type: 'jsonb' })
  scopes!: ApiKeyScope[];

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

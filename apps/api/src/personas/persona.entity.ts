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
import type {
  PersonaBoundaries,
  PersonaIdentity,
  PersonaPermissions,
  PersonaVoice,
} from '@getpersona/shared';

@Entity('personas')
@Index(['ownerUserId'])
@Index(['ownerUserId', 'slug'], { unique: true })
export class PersonaEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'owner_user_id', type: 'varchar', length: 128 })
  ownerUserId!: string;

  @Column({ name: 'display_name', type: 'varchar', length: 120 })
  displayName!: string;

  @Column({ type: 'varchar', length: 64 })
  slug!: string;

  @Column({ type: 'jsonb' })
  identity!: PersonaIdentity;

  @Column({ type: 'jsonb' })
  voice!: PersonaVoice;

  @Column({ type: 'jsonb' })
  boundaries!: PersonaBoundaries;

  @Column({ type: 'jsonb' })
  permissions!: PersonaPermissions;

  /** Fork source gate — public personas only. Kept in sync with permissions.visibility. */
  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic!: boolean;

  @Column({ name: 'archived_at', type: 'timestamptz', nullable: true })
  archivedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

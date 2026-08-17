import { BeforeInsert, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity('episodes')
@Index(['personaId', 'sourceKind', 'sourceId'], { unique: true })
export class EpisodeEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'persona_id', type: 'uuid' })
  @Index()
  personaId!: string;

  @Column({ name: 'source_kind', type: 'varchar', length: 64 })
  sourceKind!: string;

  @Column({ name: 'source_id', type: 'varchar', length: 128 })
  sourceId!: string;

  @Column({ type: 'text' })
  summary!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}

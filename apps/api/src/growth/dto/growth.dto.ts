import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

const MEMORY_KINDS = [
  'fact',
  'decision',
  'said',
  'relationship',
  'identity',
  'voice',
  'boundary',
] as const;

export class RememberCandidateDto {
  @IsIn(MEMORY_KINDS)
  kind!: (typeof MEMORY_KINDS)[number];

  @IsObject()
  payload!: Record<string, unknown>;
}

export class RememberDto {
  @IsString()
  @MinLength(1)
  personaId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  sourceKind!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  sourceId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  summary!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => RememberCandidateDto)
  candidate!: RememberCandidateDto;
}

export class PromoteDto {
  @IsString()
  @MinLength(1)
  candidateId!: string;

  @IsOptional()
  @IsBoolean()
  confirmGate?: boolean;
}

export class ProjectDto {
  @IsString()
  @MinLength(1)
  personaId!: string;

  @IsIn(['post', 'comment', 'reply'])
  kind!: 'post' | 'comment' | 'reply';

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  channel?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  language?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  query?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  limit?: number;
}

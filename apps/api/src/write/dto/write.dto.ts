import { Type } from 'class-transformer';
import {
  IsArray,
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

export class WriteThreadTurnDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  role?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  text!: string;
}

export class WriteSourceDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  brief?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  text?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WriteThreadTurnDto)
  thread?: WriteThreadTurnDto[];
}

export class WriteSubjectsDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  own?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  speaker?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  host?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  about?: string;
}

export class WriteConstraintsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4000)
  maxLength?: number;

  @IsOptional()
  @IsBoolean()
  allowLinks?: boolean;

  @IsOptional()
  @IsIn(['public', 'private', 'unlisted'])
  visibility?: 'public' | 'private' | 'unlisted';
}

export class WriteDto {
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
  @IsObject()
  @ValidateNested()
  @Type(() => WriteSourceDto)
  source?: WriteSourceDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WriteSubjectsDto)
  subjects?: WriteSubjectsDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => WriteConstraintsDto)
  constraints?: WriteConstraintsDto;

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

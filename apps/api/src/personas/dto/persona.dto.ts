import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class PersonaIdentityDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  who!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  intent!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(32)
  language!: string;
}

export class PersonaVoiceDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  typing!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  stance!: string;

  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  sampleSentences!: string[];
}

export class PersonaBoundariesDto {
  @IsArray()
  @IsString({ each: true })
  doNotSay!: string[];
}

export class PersonaPermissionsDto {
  @IsIn(['private', 'public'])
  visibility!: 'private' | 'public';

  @IsIn(['none', 'assist', 'full'])
  automation!: 'none' | 'assist' | 'full';
}

export class CreatePersonaDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  displayName!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  slug?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PersonaIdentityDto)
  identity!: PersonaIdentityDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PersonaVoiceDto)
  voice!: PersonaVoiceDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonaBoundariesDto)
  boundaries?: PersonaBoundariesDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonaPermissionsDto)
  permissions?: PersonaPermissionsDto;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class PatchPersonaIdentityDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  who?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  intent?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(32)
  language?: string;
}

export class PatchPersonaVoiceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  typing?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  stance?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsString({ each: true })
  sampleSentences?: string[];
}

export class PatchPersonaBoundariesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  doNotSay?: string[];
}

export class PatchPersonaPermissionsDto {
  @IsOptional()
  @IsIn(['private', 'public'])
  visibility?: 'private' | 'public';

  @IsOptional()
  @IsIn(['none', 'assist', 'full'])
  automation?: 'none' | 'assist' | 'full';
}

export class PatchPersonaDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  slug?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PatchPersonaIdentityDto)
  identity?: PatchPersonaIdentityDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PatchPersonaVoiceDto)
  voice?: PatchPersonaVoiceDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PatchPersonaBoundariesDto)
  boundaries?: PatchPersonaBoundariesDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PatchPersonaPermissionsDto)
  permissions?: PatchPersonaPermissionsDto;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

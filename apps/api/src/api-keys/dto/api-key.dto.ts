import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

const SCOPES = ['write', 'promote'] as const;

export class CreateApiKeyDto {
  @ApiProperty({ example: 'ci-write' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({
    isArray: true,
    enum: SCOPES,
    default: ['write'],
    description: 'write and/or promote (D-007: write alone cannot promote)',
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(SCOPES, { each: true })
  scopes?: Array<(typeof SCOPES)[number]>;
}

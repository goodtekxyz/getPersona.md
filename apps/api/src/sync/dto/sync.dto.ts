import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneSyncHandle', async: false })
export class AtLeastOneSyncHandleConstraint implements ValidatorConstraintInterface {
  validate(value: SyncSourceHandlesDto | undefined) {
    return Boolean(value?.blog?.trim() || value?.x?.trim() || value?.threads?.trim());
  }

  defaultMessage(_args: ValidationArguments) {
    return 'At least one source handle (blog, x, or threads) is required.';
  }
}

export class SyncSourceHandlesDto {
  @IsOptional()
  @IsString()
  @MaxLength(512)
  blog?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  x?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  threads?: string;
}

export class EnqueueSyncDto {
  @IsString()
  @MinLength(1)
  personaId!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SyncSourceHandlesDto)
  @Validate(AtLeastOneSyncHandleConstraint)
  handles!: SyncSourceHandlesDto;
}

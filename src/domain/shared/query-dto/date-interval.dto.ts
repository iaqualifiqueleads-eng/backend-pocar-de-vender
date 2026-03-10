import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class DateIntervalDto {
  @ApiProperty({
    description: 'Inicio',
    required: false,
    name: 'from',
    default: '2024-01-01',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  public readonly from?: Date;

  @ApiProperty({
    description: 'Fim',
    required: false,
    name: 'to',
    default: '2024-12-31',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  public readonly to?: Date;
}

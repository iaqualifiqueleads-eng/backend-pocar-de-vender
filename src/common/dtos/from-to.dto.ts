import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";
import { Timestamp } from "typeorm";

export class BetweenQueryDto {
  @ApiProperty({
    type: Timestamp,
    // example: '2024-12-03',
    description: 'From 2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  public readonly from?: Date;

  @ApiProperty({
    type: Timestamp,
    // example: '2024-12-03',
    description: 'To 2025-12-31',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  public readonly to?: Date;

}
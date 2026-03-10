import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMilitaryTime } from 'class-validator';
import { Timestamp } from 'typeorm';

export class UpdateAgendamentoDto {
  @ApiProperty({
    type: String,
    example: '2024-12-03',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({
    type: String,
    example: '13:15',
  })
  @IsMilitaryTime()
  time: Timestamp;
}

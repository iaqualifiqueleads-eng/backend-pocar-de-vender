import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMilitaryTime, IsNumberString, MaxLength } from 'class-validator';
import { Timestamp } from 'typeorm';

export class CreateAgendamentoDto {
  @ApiProperty({
    type: String,
    example: '2024-12-03',
  })
  @MaxLength(10)
  @IsDateString()
  date: string;

  @ApiProperty({
    type: String,
    example: '13:15',
  })
  @IsMilitaryTime()
  time: string;

  @ApiProperty({
    type: String,
    example: '123',
  })
  @IsNumberString()
  cliente: string;

  @ApiProperty({
    type: String,
    example: '789',
  })
  @IsNumberString()
  usuario: string;
}

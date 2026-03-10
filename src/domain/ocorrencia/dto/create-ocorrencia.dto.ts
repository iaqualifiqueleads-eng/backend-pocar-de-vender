import { ApiProperty } from '@nestjs/swagger';
import { OcorrenciaTipo } from '../enums/ocorrencia-tipo.enum';
import { IsArray, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, Matches } from 'class-validator';
import { CreateOcorrenciaFlagDto } from 'src/domain/ocorrencia-flag/dto/create-ocorrencia-flag.dto';
import { Type } from 'class-transformer';

export class CreateOcorrenciaDto {
  @ApiProperty({
    type: String,
    example: 'Finalizado',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    type: [String],
    example: ['1', '2', '3'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  flag_ids?: string[];

  @ApiProperty({
    type: [CreateOcorrenciaFlagDto],
    required: false,
  })
  @Type(() => CreateOcorrenciaFlagDto)
  flags: CreateOcorrenciaFlagDto[]
}
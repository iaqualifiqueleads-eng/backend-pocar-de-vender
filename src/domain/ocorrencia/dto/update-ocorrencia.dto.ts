import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OcorrenciaTipo } from '../enums/ocorrencia-tipo.enum';

export class UpdateOcorrenciaDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nome?: string;

  @ApiProperty({
    type: OcorrenciaTipo,
    example: OcorrenciaTipo.PRIMARIO,
    enum: OcorrenciaTipo,
    required: false,
  })
  @IsOptional()
  @IsEnum(OcorrenciaTipo)
  tipo?: OcorrenciaTipo;
}

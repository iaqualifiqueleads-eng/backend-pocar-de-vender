

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class OcorrenciaIdQueryDto {
  @ApiProperty({
    description: 'Ocorrencia ID',
    required: false,
    name: 'ocorrenciaId',
  })
  @IsString()
  @IsOptional()
  public readonly ocorrenciaId?: string;
}
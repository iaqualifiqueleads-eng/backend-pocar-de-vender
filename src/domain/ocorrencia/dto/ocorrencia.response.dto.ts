import { ApiProperty } from '@nestjs/swagger';
import { OcorrenciaTipo } from '../enums/ocorrencia-tipo.enum';
import { BaseResponseDto } from 'src/common/dtos/base.response.dto';

export class OcorrenciaResponseDto extends BaseResponseDto {
  @ApiProperty({
    type: String,
  })
  nome: string;

  @ApiProperty({
    type: OcorrenciaTipo,
    enum: OcorrenciaTipo,
  })
  tipo: OcorrenciaTipo;
}

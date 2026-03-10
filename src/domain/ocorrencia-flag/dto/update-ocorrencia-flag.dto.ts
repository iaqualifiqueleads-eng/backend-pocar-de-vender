import { PartialType } from '@nestjs/swagger';
import { CreateOcorrenciaFlagDto } from './create-ocorrencia-flag.dto';

export class UpdateOcorrenciaFlagDto extends PartialType(CreateOcorrenciaFlagDto) {}

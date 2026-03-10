import { PartialType } from '@nestjs/swagger';
import { CreatePerdaDto } from './create-perda.dto';

export class UpdatePerdaDto extends PartialType(CreatePerdaDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateFunilDto } from './create-funil.dto';

export class UpdateFunilDto extends PartialType(CreateFunilDto) {}

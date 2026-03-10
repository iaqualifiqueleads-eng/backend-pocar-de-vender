import { PartialType } from '@nestjs/swagger';
import { CreateTransferenciaClienteDto } from './create-transferencia-cliente.dto';

export class UpdateTransferenciaClienteDto extends PartialType(CreateTransferenciaClienteDto) {}

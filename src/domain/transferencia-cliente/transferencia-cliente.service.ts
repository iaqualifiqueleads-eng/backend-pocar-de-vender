import { Injectable } from '@nestjs/common';
import { CreateTransferenciaClienteDto } from './dto/create-transferencia-cliente.dto';
import { UpdateTransferenciaClienteDto } from './dto/update-transferencia-cliente.dto';

@Injectable()
export class TransferenciaClienteService {
  create(createTransferenciaClienteDto: CreateTransferenciaClienteDto) {
    return 'This action adds a new transferenciaCliente';
  }

  findAll() {
    return `This action returns all transferenciaCliente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transferenciaCliente`;
  }

  update(id: number, updateTransferenciaClienteDto: UpdateTransferenciaClienteDto) {
    return `This action updates a #${id} transferenciaCliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} transferenciaCliente`;
  }
}

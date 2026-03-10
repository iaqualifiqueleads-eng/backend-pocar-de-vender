import { Module } from '@nestjs/common';
import { TransferenciaClienteService } from './transferencia-cliente.service';
import { TransferenciaClienteController } from './transferencia-cliente.controller';

@Module({
  controllers: [TransferenciaClienteController],
  providers: [TransferenciaClienteService],
})
export class TransferenciaClienteModule {}

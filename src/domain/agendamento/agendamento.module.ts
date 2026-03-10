import { forwardRef, Module } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { AgendamentoController } from './agendamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { ClienteModule } from '../cliente/cliente.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtService } from '@nestjs/jwt';
import { ContatoModule } from '../contato/contato.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento]),
    // ClienteModule,
    UsuarioModule,
    // forwardRef(() => ContatoModule),
    forwardRef(() => ClienteModule)
  ],
  controllers: [AgendamentoController],
  providers: [AgendamentoService, JwtService],
  exports: [AgendamentoService],
})
export class AgendamentoModule { }

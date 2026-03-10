import { forwardRef, Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { TelefoneModule } from '../telefone/telefone.module';
import { JwtService } from '@nestjs/jwt';
import { EnderecoModule } from '../endereco/endereco.module';
import { AgendamentoModule } from '../agendamento/agendamento.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    forwardRef(() => AgendamentoModule),
    UsuarioModule,
    TelefoneModule,
    EnderecoModule,
  ],
  controllers: [ClienteController],
  providers: [ClienteService, JwtService],
  exports: [ClienteService],
})
export class ClienteModule { }

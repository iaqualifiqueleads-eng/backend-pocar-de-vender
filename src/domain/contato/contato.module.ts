import { forwardRef, Module } from '@nestjs/common';
import { ContatoService } from './contato.service';
import { ContatoController } from './contato.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contato } from './entities/contato.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { ClienteModule } from '../cliente/cliente.module';
import { OcorrenciaModule } from '../ocorrencia/ocorrencia.module';
import { ProdutoModule } from '../produto/produto.module';
import { FunilModule } from '../funil/funil.module';
import { JwtService } from '@nestjs/jwt';
import { AgendamentoModule } from '../agendamento/agendamento.module';
import { AgendamentoService } from '../agendamento/agendamento.service';
import { MetricasUsuarioModule } from '../metricas-usuario/metricas-usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contato]),
    UsuarioModule,
    ClienteModule,
    ProdutoModule,
    FunilModule,
    MetricasUsuarioModule,

    forwardRef(() => AgendamentoModule),
    forwardRef(() => OcorrenciaModule),
  ],
  controllers: [ContatoController],
  providers: [ContatoService, JwtService],
  exports: [ContatoService],
})
export class ContatoModule { }

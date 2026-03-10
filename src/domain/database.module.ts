import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UsuarioModule } from './usuario/usuario.module';
import { OcorrenciaModule } from './ocorrencia/ocorrencia.module';
import { ClienteModule } from './cliente/cliente.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { ContatoModule } from './contato/contato.module';
import ormConfig, { getDatabaseSystemIds } from 'src/config/orm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnderecoModule } from './endereco/endereco.module';
import { FunilModule } from './funil/funil.module';
import { OcorrenciaFlagModule } from './ocorrencia-flag/ocorrencia-flag.module';
import { ProdutoModule } from './produto/produto.module';
import { FornecedorModule } from './fornecedor/fornecedor.module';
import { VendaModule } from './venda/venda.module';
import { PerdaModule } from './perda/perda.module';
import { TransferenciaClienteModule } from './transferencia-cliente/transferencia-cliente.module';
import { PermissaoModule } from './permissao/permissao.module';
import { TelefoneModule } from './telefone/telefone.module';
import { MetricasUsuarioModule } from './metricas-usuario/metricas-usuario.module';
import { LogsErrorsModule } from './logs-errors/logs-errors.module';
import { OrigemModule } from './origem/origem.module';

const databasesConfig = getDatabaseSystemIds().map((systemId) => {
  return TypeOrmModule.forRootAsync({
    name: `database-${systemId}`,
    imports: [ConfigModule.forFeature(ormConfig)],
    useFactory: async (config: ConfigService) => config.get(`orm.${systemId}`),
    inject: [ConfigService],
  });
});

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ...databasesConfig,
    LogsErrorsModule,
    OcorrenciaModule,
    ClienteModule,
    AgendamentoModule,
    ContatoModule,
    EnderecoModule,
    FunilModule,
    OcorrenciaFlagModule,
    ProdutoModule,
    FornecedorModule,
    VendaModule,
    PerdaModule,
    TransferenciaClienteModule,
    PermissaoModule,
    TelefoneModule,
    UsuarioModule,
    MetricasUsuarioModule,
    OrigemModule,
  ],
  providers: []
})
export class DataBaseModule { }

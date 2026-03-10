import { Module } from '@nestjs/common';
import { MetricasUsuarioService } from './metricas-usuario.service';
import { MetricasUsuarioController } from './metricas-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricasUsuario } from './entities/metricas-usuario.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { OcorrenciaModule } from '../ocorrencia/ocorrencia.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([MetricasUsuario]),
    UsuarioModule,
    OcorrenciaModule,
  ],
  controllers: [MetricasUsuarioController],
  providers: [MetricasUsuarioService, JwtService],
  exports: [MetricasUsuarioService],
})
export class MetricasUsuarioModule { }

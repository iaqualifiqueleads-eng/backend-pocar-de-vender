import { Module } from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { OcorrenciaController } from './ocorrencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { JwtService } from '@nestjs/jwt';
import { OcorrenciaFlagModule } from '../ocorrencia-flag/ocorrencia-flag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ocorrencia]), OcorrenciaFlagModule],
  controllers: [OcorrenciaController],
  providers: [OcorrenciaService, JwtService],
  exports: [OcorrenciaService],
})
export class OcorrenciaModule { }

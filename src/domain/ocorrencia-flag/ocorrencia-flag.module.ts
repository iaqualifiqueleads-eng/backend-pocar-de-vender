import { Module } from '@nestjs/common';
import { OcorrenciaFlagService } from './ocorrencia-flag.service';
import { OcorrenciaFlagController } from './ocorrencia-flag.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciaFlag } from './entities/ocorrencia-flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OcorrenciaFlag])],
  controllers: [OcorrenciaFlagController],
  providers: [OcorrenciaFlagService, JwtService],
  exports: [OcorrenciaFlagService],
})
export class OcorrenciaFlagModule { }

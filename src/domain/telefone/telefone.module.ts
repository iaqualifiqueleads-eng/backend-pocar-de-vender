import { Module } from '@nestjs/common';
import { TelefoneService } from './telefone.service';
import { TelefoneController } from './telefone.controller';
import { JwtService } from '@nestjs/jwt';
import { Telefone } from './entities/telefone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Telefone])],
  controllers: [TelefoneController],
  providers: [TelefoneService, JwtService],
  exports: [TelefoneService],
})
export class TelefoneModule { }

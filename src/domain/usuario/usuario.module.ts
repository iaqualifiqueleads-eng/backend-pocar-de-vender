import { Module } from '@nestjs/common';
import { UsuarioService } from 'src/domain/usuario/usuario.service';
import { UsuarioController } from 'src/domain/usuario/usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/domain/usuario/entities/usuario.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [UsuarioService, JwtService],
  exports: [UsuarioService],
})
export class UsuarioModule { }

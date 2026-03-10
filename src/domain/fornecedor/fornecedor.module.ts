import { Module } from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';
import { FornecedorController } from './fornecedor.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fornecedor } from './entities/fornecedor.entity';
import { TelefoneModule } from '../telefone/telefone.module';
import { EnderecoModule } from '../endereco/endereco.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fornecedor]), TelefoneModule, EnderecoModule],
  controllers: [FornecedorController],
  providers: [FornecedorService, JwtService],
  exports: [FornecedorService],
})
export class FornecedorModule { }

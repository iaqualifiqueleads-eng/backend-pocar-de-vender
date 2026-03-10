import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { FornecedorModule } from '../fornecedor/fornecedor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Produto]), FornecedorModule],
  controllers: [ProdutoController],
  providers: [ProdutoService, JwtService],
  exports: [ProdutoService],
})
export class ProdutoModule { }

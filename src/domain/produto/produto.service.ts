import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ModuleRef } from '@nestjs/core';
import { Produto } from './entities/produto.entity';
import { FornecedorService } from '../fornecedor/fornecedor.service';
import { BaseService } from '../shared/base-service';

@Injectable()
export class ProdutoService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly fornecedorService: FornecedorService,

  ) {
    super(moduleRef);
  }
  async create(systemId: string, createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const entityManager = this.loadEntityManager(systemId);
    const produto = entityManager.create(Produto, createProdutoDto);

    // encontra fornecedores
    if (createProdutoDto.fornecedores.length > 0) {
      const fornecedores = await Promise.all(createProdutoDto.fornecedores.map(async (fornecedor) => {
        return await this.fornecedorService.findOne(systemId, fornecedor.id)
      }))

      produto.fornecedores = fornecedores
    }


    return await entityManager.save(Produto, produto);
  }

  async findAll(systemId: string): Promise<Produto[]> {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.find(Produto);
  }

  async findOne(systemId: string, id: string): Promise<Produto> {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(Produto, {
      where: { id },
    });
  }

  async update(systemId: string, id: string, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const entityManager = this.loadEntityManager(systemId);

    const produto = await this.findOne(systemId, id)

    const result = await entityManager.update(Produto, id, {
      ...produto,
      ...updateProdutoDto
    }
    )

    if (result.affected === 0) throw new InternalServerErrorException("Produto não atualizado.")

    return await this.findOne(systemId, id)
  }

  async remove(systemId: string, id: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);
    const result = await entityManager.delete(Produto, id)

    if (result.affected === 0) throw new InternalServerErrorException("Produto não deletado.")


    return "Produto deletado com ucesso."
  }
}

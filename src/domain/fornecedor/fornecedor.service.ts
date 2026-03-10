import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { ModuleRef } from '@nestjs/core';
import { Fornecedor } from './entities/fornecedor.entity';
import { TelefoneService } from '../telefone/telefone.service';
import { EnderecoService } from '../endereco/endereco.service';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { BaseService } from '../shared/base-service';

@Injectable()
export class FornecedorService extends BaseService {

  constructor(
    moduleRef: ModuleRef,
    private readonly telefoneService: TelefoneService,
    private readonly enderecoService: EnderecoService,
  ) {
    super(moduleRef);
  }

  async create(systemId: string, createFornecedorDto: CreateFornecedorDto) {
    const entityManager = this.loadEntityManager(systemId);
    const fornecedor = entityManager.create(Fornecedor, {
      nome: createFornecedorDto.nome,
    });

    // cria endereco
    if (createFornecedorDto.endereco) {
      const endereco = await this.enderecoService.create(systemId, createFornecedorDto.endereco)
      fornecedor.endereco = endereco
    }

    // cria telefones
    if (createFornecedorDto.telefones.length > 0) {
      const telefones = await Promise.all(createFornecedorDto.telefones.map(async (numero) => {
        return await this.telefoneService.create(systemId, { ddd: numero.ddd, numero: numero.numero })
      }))

      fornecedor.telefones = telefones
    }


    return await entityManager.save(Fornecedor, fornecedor);
  }

  async findAll(systemId: string, { page = 1, limit = 10 }: PaginationDto) {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.find(Fornecedor, {
      skip: (page - 1) * limit,
      take: limit,
    })
  }

  async findOne(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.findOne(Fornecedor, {
      where: { id },
    });
  }

  async update(systemId: string, id: string, updateFornecedorDto: UpdateFornecedorDto) {
    const entityManager = this.loadEntityManager(systemId);
    const fornecedor = await entityManager.findOne(Fornecedor, {
      where: { id },
    });

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor não encontrado.`);
    }

    const result = await entityManager.update(Fornecedor, id, {
      ...fornecedor,
      ...updateFornecedorDto,
    });

    if (!result.affected) {
      throw new NotFoundException(`Fornecedor não encontrado.`);
    }

    return this.findOne(systemId, id);

  }

  async remove(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);

    const fornecedor = await entityManager.findOne(Fornecedor, {
      where: { id },
    });

    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor não encontrado.`);
    }

    const result = await entityManager.softDelete(Fornecedor, id);

    if (!result.affected) {
      throw new NotFoundException(`Fornecedor não encontrado.`);
    }

    return 'Fornecedor deletado com sucesso.';
  }
}

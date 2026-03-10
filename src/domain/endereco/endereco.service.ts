import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { ModuleRef } from '@nestjs/core';
import { Endereco } from './entities/endereco.entity';
import { BaseService } from '../shared/base-service';

@Injectable()
export class EnderecoService extends BaseService {
  constructor(
    moduleRef: ModuleRef
  ) {
    super(moduleRef)
  }


  async exists(systemId: string, filter: { id?: string, email?: string, cnpj?: string }): Promise<boolean> {
    const entityManager = this.loadEntityManager(systemId);
    return !!(await entityManager.findOneBy(Endereco, filter));
  }
  async create(systemId: string, createEnderecoDto: CreateEnderecoDto) {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.save(Endereco, entityManager.create(Endereco, createEnderecoDto));
  }

  async findOne(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.findOne(Endereco, { where: { id } });
  }

  async update(systemId: string, id: string, updateEnderecoDto: UpdateEnderecoDto) {
    const entityManager = this.loadEntityManager(systemId);
    const endereco = await entityManager.findOne(Endereco, { where: { id } });

    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    const result = await entityManager.update(Endereco, id, {
      ...endereco,
      ...updateEnderecoDto,
    });

    if (!result.affected) {
      throw new InternalServerErrorException('Erro ao atualizar endereço.');
    }

    return this.findOne(systemId, id);
  }

  async remove(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);
    const endereco = await entityManager.findOne(Endereco, { where: { id } });

    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado.');
    }

    const result = await entityManager.delete(Endereco, endereco);

    if (result.affected === 0) throw new InternalServerErrorException('Erro ao remover endereço.');

    return "Endereço removido com sucesso.";
  }
}

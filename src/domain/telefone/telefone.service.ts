import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateTelefoneDto } from './dto/create-telefone.dto';
import { UpdateTelefoneDto } from './dto/update-telefone.dto';
import { ModuleRef } from '@nestjs/core';
import { Telefone } from './entities/telefone.entity';
import { BaseService } from '../shared/base-service';

@Injectable()
export class TelefoneService extends BaseService {

  constructor(
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(systemId: string, createTelefoneDto: CreateTelefoneDto): Promise<Telefone> {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.save(Telefone, entityManager.create(Telefone, createTelefoneDto));
  }

  async findOne(systemId: string, id: string): Promise<Telefone> {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(Telefone, { where: { id } });
  }

  async update(systemId: string, updateTelefoneDto: UpdateTelefoneDto): Promise<Telefone> {
    const entityManager = this.loadEntityManager(systemId);

    const telefone = await entityManager.findOne(Telefone, { where: { id: updateTelefoneDto.id } });

    if (!telefone) {
      throw new NotFoundException('Erro ao atualizar telefone');
    }

    const result = await entityManager.update(Telefone, updateTelefoneDto.id, {
      ...telefone,
      ...updateTelefoneDto,
    });

    if (!result.affected) {
      throw new BadRequestException('Erro ao atualizar usuário');
    }

    return this.findOne(systemId, updateTelefoneDto.id);
  }

  async deleteEmptyPhones(systemId: string) {
    const entityManager = this.loadEntityManager(systemId);

    const telefones = await entityManager.find(Telefone, {
      where: {
        numero: '',
      },
    });

    if (telefones.length === 0) return;

    const affected = await entityManager.delete(Telefone, telefones.map((telefone) => telefone.id));

    return telefones;
  }

  async remove(systemId: string, id: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);
    const result = await entityManager.delete(Telefone, id);

    if (result.affected === 0) {
      throw new InternalServerErrorException('Erro ao remover telefone');
    }

    return "Telefone removido com sucesso.";
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFunilDto } from './dto/create-funil.dto';
import { UpdateFunilDto } from './dto/update-funil.dto';
import { ModuleRef } from '@nestjs/core';
import { Funil } from './entities/funil.entity';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { BaseService } from '../shared/base-service';

@Injectable()
export class FunilService extends BaseService {

  constructor(
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(systemId: string, createFunilDto: CreateFunilDto) {
    const entityManager = this.loadEntityManager(systemId);

    const funil = entityManager.create(Funil, createFunilDto);

    return await entityManager.save(Funil, funil);
  }

  async findAll(systemId: string, { page = 1, limit = 10 }: PaginationDto) {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.find(Funil, {
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(Funil, { where: { id } });
  }

  async update(systemId: string, id: string, updateFunilDto: UpdateFunilDto) {
    const entityManager = this.loadEntityManager(systemId);

    const result = await entityManager.update(Funil, id, {
      ...updateFunilDto,
    });

    if (!result.affected) {
      throw new BadRequestException('Erro ao atualizar funil');
    }

    return this.findOne(systemId, id);
  }

  async remove(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);

    const result = await entityManager.softDelete(Funil, id);
    if (!result.affected) {
      throw new BadRequestException('Erro ao remover funil');
    }

    return 'Funil deletado com sucesso.';
  }
}

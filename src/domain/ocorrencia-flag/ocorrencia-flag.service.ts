import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOcorrenciaFlagDto } from './dto/create-ocorrencia-flag.dto';
import { UpdateOcorrenciaFlagDto } from './dto/update-ocorrencia-flag.dto';
import { ModuleRef } from '@nestjs/core';
import { OcorrenciaFlag } from './entities/ocorrencia-flag.entity';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { BaseService } from '../shared/base-service';

@Injectable()
export class OcorrenciaFlagService extends BaseService {

  constructor(
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(systemId: string, createOcorrenciaFlagDto: CreateOcorrenciaFlagDto): Promise<OcorrenciaFlag> {
    const entityManager = this.loadEntityManager(systemId);

    const ocorrenciaFlag = entityManager.create(OcorrenciaFlag, createOcorrenciaFlagDto);

    return await entityManager.save(OcorrenciaFlag, ocorrenciaFlag);
  }

  async findAll(systemId: string, { page = 1, limit = 10 }: PaginationDto): Promise<OcorrenciaFlag[]> {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.find(OcorrenciaFlag, {
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(systemId: string, id: string): Promise<OcorrenciaFlag> {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(OcorrenciaFlag, { where: { id } });
  }

  async update(systemId: string, id: string, updateOcorrenciaFlagDto: UpdateOcorrenciaFlagDto): Promise<OcorrenciaFlag> {
    const entityManager = this.loadEntityManager(systemId);

    const result = await entityManager.update(OcorrenciaFlag, id, {
      ...updateOcorrenciaFlagDto,
    });

    if (!result.affected) {
      throw new BadRequestException('Erro ao atualizar Ocorrência Flag');
    }

    return this.findOne(systemId, id);
  }

  async remove(systemId: string, id: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);

    const result = await entityManager.softDelete(OcorrenciaFlag, id);
    if (!result.affected) {
      throw new BadRequestException('Erro ao remover Ocorrência Flag');
    }

    return 'Ocorrência Flag deletado com sucesso.';

  }
}

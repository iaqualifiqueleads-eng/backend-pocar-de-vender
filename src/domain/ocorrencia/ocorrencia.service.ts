import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { ModuleRef } from '@nestjs/core';
import { OcorrenciaFlagService } from '../ocorrencia-flag/ocorrencia-flag.service';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { BaseService } from '../shared/base-service';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class OcorrenciaService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly ocorrenciaFlagService: OcorrenciaFlagService,
  ) {
    super(moduleRef);
  }

  async create(systemId: string, createOcorrenciaDto: CreateOcorrenciaDto): Promise<Ocorrencia> {
    const entityManager = this.loadEntityManager(systemId);

    const existe = await entityManager.findOne(Ocorrencia, {
      where: { nome: createOcorrenciaDto.nome },
    });
    if (existe) {
      throw new BadRequestException(`Ocorrencia '${createOcorrenciaDto.nome}' já cadastrada`);
    }

    const ocorrencia = entityManager.create(Ocorrencia, {
      ...createOcorrenciaDto,
    });

    // cria flags
    if (createOcorrenciaDto.flags) {
      ocorrencia.flags = await Promise.all(createOcorrenciaDto.flags.map(async (oc_flag) => {
        return await this.ocorrenciaFlagService.create(systemId, oc_flag)
      }
      ))
    }

    // encontrar flags pelo id
    if (createOcorrenciaDto.flag_ids) {
      const flags = await Promise.all(createOcorrenciaDto.flag_ids.map(async (flag_id) => {
        return await this.ocorrenciaFlagService.findOne(systemId, flag_id)
      }))
      ocorrencia.flags = [...ocorrencia.flags, ...flags]
    }

    return await entityManager.save(Ocorrencia, ocorrencia);
  }

  async findAll(systemId: string, { page, limit }: PaginationDto): Promise<Ocorrencia[]> {
    const entityManager = this.loadEntityManager(systemId);

    const options: FindManyOptions<Ocorrencia> = {};

    if (page && limit) {
      options.skip = (page - 1) * limit;
      options.take = limit;
    }

    return await entityManager.find(Ocorrencia, { ...options, order: { nome: 'ASC' } });
  }

  async findOne(systemId: string, id: string): Promise<Ocorrencia> {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(Ocorrencia, {
      where: { id },

    });
  }

  async update(systemId: string, id: string, updateOcorrenciaDto: UpdateOcorrenciaDto): Promise<Ocorrencia> {
    const entityManager = this.loadEntityManager(systemId);

    const response = await entityManager.update(Ocorrencia, id, {
      ...updateOcorrenciaDto,
    });

    if (!response.affected) {
      throw new Error('Erro ao atualizar ocorrencia');
    }

    return await this.findOne(systemId, id);
  }

  async remove(systemId: string, id: number): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);

    // const response = await entityManager.softDelete(Ocorrencia, id);
    const response = await entityManager.delete(Ocorrencia, id);

    if (!response.affected) {
      throw new Error('Erro ao deletar ocorrencia');
    }

    return 'Ocorrência deletada com sucesso';
  }
}

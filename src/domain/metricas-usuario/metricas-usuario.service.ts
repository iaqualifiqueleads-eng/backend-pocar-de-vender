import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetricasUsuarioDto } from './dto/create-metricas-usuario.dto';
import { UpdateMetricasUsuarioDto } from './dto/update-metricas-usuario.dto';
import { ModuleRef } from '@nestjs/core';
import { UsuarioService } from '../usuario/usuario.service';
import { OcorrenciaService } from '../ocorrencia/ocorrencia.service';
import { MetricasUsuario } from './entities/metricas-usuario.entity';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { UsuarioIdQueryDto } from 'src/common/dtos/usuario-id.dto';
import { OcorrenciaIdQueryDto } from 'src/common/dtos/ocorrencia-id.dto';
import { BaseService } from '../shared/base-service';
import { BetweenQueryDto } from 'src/common/dtos/from-to.dto';
import { subDays } from 'date-fns';
import { Between } from 'typeorm';

@Injectable()
export class MetricasUsuarioService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly usuarioService: UsuarioService,
    private readonly ocorrenciaService: OcorrenciaService,
  ) {
    super(moduleRef);
  }

  async handleCreateOrUpdate(systemId: string, createMetricasUsuarioDto: CreateMetricasUsuarioDto) {
    const { usuarioId, ocorrenciaId, duracao_segundos = 0 } = createMetricasUsuarioDto;

    const [usuario, ocorrencia] = await Promise.all([
      this.usuarioService.findOne(systemId, { id: usuarioId }),
      this.ocorrenciaService.findOne(systemId, ocorrenciaId),
    ]);

    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    if (!ocorrencia) throw new NotFoundException('Ocorrencia não encontrada');

    // Verifica se a métrica já existe
    const existingMetrica = await this.findAll(systemId, { usuarioId, ocorrenciaId, limit: 1, page: 1 });

    if (existingMetrica.length > 0) {
      // Atualiza a métrica existente
      await this.update(systemId, {
        usuarioId,
        ocorrenciaId,
        adicionar_segundos: duracao_segundos
      });
      return existingMetrica; // Retorna a métrica atualizada
    }

    // cria 
    return await this.create(systemId, createMetricasUsuarioDto);
  }

  private async create(systemId: string, createMetricasUsuarioDto: CreateMetricasUsuarioDto) {
    const entityManager = this.loadEntityManager(systemId);

    const { usuarioId, ocorrenciaId, duracao_segundos = 0 } = createMetricasUsuarioDto;

    const [usuario, ocorrencia] = await Promise.all([
      this.usuarioService.findOne(systemId, { id: usuarioId }),
      this.ocorrenciaService.findOne(systemId, ocorrenciaId),
    ]);

    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    if (!ocorrencia) throw new NotFoundException('Ocorrencia não encontrada');

    const metrica = entityManager.create(MetricasUsuario, {
      usuario,
      ocorrencia,
      duracao_segundos
    });

    return await entityManager.save(MetricasUsuario, metrica);
  }

  async findOne(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(MetricasUsuario, {
      where: { id },
    });
  }

  async findAll(systemId: string, { usuarioId, ocorrenciaId, page = 1, limit = 10 }: PaginationDto & UsuarioIdQueryDto & OcorrenciaIdQueryDto) {
    const entityManager = this.loadEntityManager(systemId);

    let where = {};
    if (usuarioId && !ocorrenciaId) {
      where = { usuario: { id: usuarioId } };
    }
    if (ocorrenciaId && !usuarioId) {
      where = { ocorrencia: { id: ocorrenciaId } };
    }
    if (usuarioId && ocorrenciaId) {
      where = { usuario: { id: usuarioId }, ocorrencia: { id: ocorrenciaId } };
    }

    return await entityManager.find(MetricasUsuario, {
      where,
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  private async update(systemId: string, { usuarioId, ocorrenciaId, adicionar_segundos }: UpdateMetricasUsuarioDto) {
    const entityManager = this.loadEntityManager(systemId);

    const metrica = await this.findAll(systemId, { limit: 1, page: 1, ocorrenciaId, usuarioId })

    if (metrica.length === 0) throw new NotFoundException('Métrica não encontrada');
    if (adicionar_segundos < 0) adicionar_segundos = 0;

    const result = await entityManager.update(MetricasUsuario, metrica[0].id, {
      duracao_segundos: metrica[0].duracao_segundos + adicionar_segundos
    })

    if (result.affected === 0) throw new NotFoundException('Erro ao atualizar métrica');

    return await this.findOne(systemId, metrica[0].id);
  }

  async remove(systemId: string, id: number) {
    const entityManager = this.loadEntityManager(systemId);

    const result = await entityManager.delete(MetricasUsuario, { id });

    if (result.affected === 0) throw new NotFoundException('Erro ao remover métrica');

    return 'Métrica deletada com sucesso';
  }
}

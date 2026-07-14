import { forwardRef, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateContato } from './dto/create-contato.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { ClienteService } from '../cliente/cliente.service';
import {
  ClienteQueryDto,
  UsuarioQueryDto,
} from './dto/contato-query.dto';
import { Contato } from './entities/contato.entity';
import { Between, FindOptionsWhere, In } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { OcorrenciaService } from '../ocorrencia/ocorrencia.service';
import { ProdutoService } from '../produto/produto.service';
import { AgendamentoService } from '../agendamento/agendamento.service';
import { Cliente } from '../cliente/entities/cliente.entity';
import { BetweenQueryDto } from 'src/common/dtos/from-to.dto';
import { calculateIntervalToSeconds } from 'src/utils/calculate-interval-to-seconds';
import { MetricasUsuarioService } from '../metricas-usuario/metricas-usuario.service';
import { BaseService } from '../shared/base-service';
import { OcorrenciaIdQueryDto } from 'src/common/dtos/ocorrencia-id.dto';
import { addDays, format, subDays, subWeeks } from 'date-fns';
import { PossivelClienteQueryDto } from './dto/query-possivel-cliente.dto';
import { skip } from 'node:test';

const fs = require('fs');

@Injectable()
export class ContatoService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly usuarioService: UsuarioService,
    private readonly clienteService: ClienteService,
    private readonly metricasUsuarioService: MetricasUsuarioService,

    @Inject(forwardRef(() => OcorrenciaService))
    private readonly ocorrenciaService: OcorrenciaService,
    private readonly produtoService: ProdutoService,

    @Inject(forwardRef(() => AgendamentoService))
    private readonly agendamentoService: AgendamentoService,
  ) {
    super(moduleRef)
  }
  logger = new Logger();

  async create(systemId: string, createContatoDto: CreateContato): Promise<Contato> {
    const entityManager = this.loadEntityManager(systemId);

    // encontrar usuário e cliente
    const [usuario, cliente] = await Promise.all([
      this.usuarioService.findOne(systemId, { id: createContatoDto.usuario }),
      this.clienteService.findOne(systemId, createContatoDto.cliente),
    ]);
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');

    // encontra ocorrencias
    const ocorrencias = await Promise.all(createContatoDto.ocorrencias.map(async (ocorrencia) => {
      return await this.ocorrenciaService.findOne(systemId, ocorrencia.id)
    }))
    ocorrencias.forEach(ocorrencia => {
      if (!ocorrencia) throw new NotFoundException('Ocorrencia não encontrada.');
    })


    // encontra produtos
    const produtos = await Promise.all(createContatoDto.produtos.map(async (produto) => {
      return await this.produtoService.findOne(systemId, produto.id)
    }))
    produtos.forEach(produto => {
      if (!produto) throw new NotFoundException('Produto não encontrado.');
    })

    // encontra funil
    // const funil = await this.funilService.findOne(systemId, createContatoDto.funil);

    if (createContatoDto.agendamento && !createContatoDto.nao_retornar) {
      await this.agendamentoService.create(systemId, {
        ...createContatoDto.agendamento,
        date: createContatoDto.agendamento.date.slice(0, 10),
      });
    }

    if (createContatoDto.nao_retornar === true) {
      const agendamentos = await this.agendamentoService.findAll(systemId, { clienteId: createContatoDto.cliente });
      await Promise.all(agendamentos.map((contato) => this.agendamentoService.remove(systemId, contato.id)));
    }

    const primeiro_contato = (cliente.primeiro_contato ? null : { primeiro_contato: new Date() });
    const proximo_contato = (createContatoDto.nao_retornar ? { proximo_contato: null } : { proximo_contato: createContatoDto.agendamento.date });
    await entityManager.update(Cliente, createContatoDto.cliente, {
      ultimo_contato: new Date(),
      ...primeiro_contato,
      ...proximo_contato
    });

    const cliente_atualizado = await this.clienteService.findOne(systemId, createContatoDto.cliente)

    const contato = entityManager.create(Contato, {
      usuario,
      cliente: cliente_atualizado,
      // funil,
      observacao: createContatoDto.observacao,
      inicio: createContatoDto.inicio,
      // fim: createContatoDto.fim,
      fim: new Date(),
    })
    contato.ocorrencias = ocorrencias
    contato.produtos = produtos

    const contatoCriado = await entityManager.save(Contato,
      contato
    );

    await this.metricasUsuarioService.handleCreateOrUpdate(systemId, {
      usuarioId: contato.usuario.id,
      ocorrenciaId: contatoCriado.ocorrencias[0].id,
      duracao_segundos: calculateIntervalToSeconds(new Date(contato.inicio), new Date(contato.fim))
    })

    const ocorrenciaIds = ocorrencias.map(o => o.id);
    const atualizacaoCliente: Partial<Cliente> = {};
    if (ocorrenciaIds.includes('1')) atualizacaoCliente.estocado = true;
    if (ocorrenciaIds.includes('6')) atualizacaoCliente.prefere_fornecedor_atual = true;
    if (Object.keys(atualizacaoCliente).length > 0) {
      await entityManager.update(Cliente, createContatoDto.cliente, atualizacaoCliente);
    }

    return contatoCriado
  }

  async contosCount(systemId: string, { usuario_id, ocorrenciaId }: UsuarioQueryDto & OcorrenciaIdQueryDto) {
    const entityManager = this.loadEntityManager(systemId);

    let where = {};
    if (usuario_id) {
      where = { usuario: { id: usuario_id } };
    }
    if (ocorrenciaId) {
      where = { ocorrencias: [{ id: ocorrenciaId }] };
    }

    return await entityManager.count(Contato, {
      where,
    });
  }

  async relatorio(systemId: string, { cliente_id, usuario_id, ocorenciasIds, from, to, possivel_cliente, usuariosIds }: { ocorenciasIds?: string[], usuariosIds?: string[] } & BetweenQueryDto & UsuarioQueryDto & ClienteQueryDto & PossivelClienteQueryDto) {

    const entityManager = this.loadEntityManager(systemId);

    // from = from ?? subWeeks(new Date(), 1);
    // to = to ? addDays(new Date(to), 3) : addDays(new Date(), 3);

    // this.logger.debug('[from] => ', from)
    // this.logger.debug('[to] => ', new Date(format(to, 'yyyy-MM-dd')))

    // let where = [];
    let query: FindOptionsWhere<Contato> | FindOptionsWhere<Contato>[] = {};
    if (cliente_id) {
      // where.push({ cliente: { id: cliente_id } });
      query = { ...query, cliente: { id: cliente_id } };
    }
    if (possivel_cliente) {
      query = { ...query, cliente: { possivel_cliente: possivel_cliente === 'true' ? true : false } };
    }

    // if (usuario_id) {
    //   // where.push({ usuario: { id: usuario_id } });
    //   query = { ...query, usuario: { id: usuario_id } };
    // }
    // if (ocorenciasIds) {
    //   // where.push({ ocorrencias: ocorenciasIds?.map((id) => ({ id })) });
    //   query = { ...query, ocorrencias: ocorenciasIds?.map((id) => ({ id })) };
    // }
    // if (from && to) {
    //   // where.push({ createdAt: Between(from, to) });
    //   query = { ...query, createdAt: Between(from, to) };
    // }

    if (from && to) {
      const start = new Date(from);
      const end = new Date(to);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      query = {
        ...query,
        createdAt: Between(start, end),
      };
    }

    if (!usuario_id && usuariosIds) {
      query = { ...query, usuario: usuariosIds?.map((id) => ({ id })) };
      // return await this.relatorioDashboard(systemId, { usuariosIds, from, to });
    }

    const contatos = await entityManager.find(Contato, {
      where: query,
      order: { createdAt: 'ASC' },
      relations: ['usuario', 'cliente'],
    });

    // this.logger.debug('[from] => ', from)
    // this.logger.debug('[to] => ', to)

    // this.logger.debug('[contatos do cliente - 616558690304 - length] => ', contatos.filter((contato) => contato.cliente?.id === "616558690304").length)
    // this.logger.debug('[contatos do cliente - 616558690304] => ', contatos.filter((contato) => contato.cliente?.id === "616558690304"))


    const contatosUnicosPorCliente = [
      ...new Map(contatos.filter((contato) => contato.cliente != null).map((contato) => [contato.cliente.id, contato])).values()
    ];

    // this.logger.debug('[contatosUnicosPorCliente] => ', contatosUnicosPorCliente.filter((contato) => contato.cliente?.id === "616558690304"))

    if (ocorenciasIds) {
      const filter = contatosUnicosPorCliente.filter((contato) => ocorenciasIds?.includes(`${contato.ocorrencias[0]?.id ?? ""}`)).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return filter
    }

    return contatosUnicosPorCliente.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  }

  async relatorioDashboard(
    systemId: string,
    {
      usuariosIds,
      from,
      to,
      na_base,
    }: {
      usuariosIds?: string[];
      na_base?: boolean;
    } & BetweenQueryDto,
  ) {
    const entityManager = this.loadEntityManager(systemId);

    from = from ?? subWeeks(new Date(), 1);
    to = to ?? new Date();

    let query: any = {};
    if (usuariosIds) {
      query = { ...query, usuario: usuariosIds?.map((id) => ({ id })) };
    }
    if (from && to) {
      query = { ...query, createdAt: Between(from, addDays(new Date(to), 1)) };
    }
    if (typeof na_base === 'boolean') {
      query.cliente = {
        ...query.cliente,
        na_base,
      };
    }

    // console.log('[query] => ', query);

    return await entityManager.find(Contato, {
      where: query,
      order: { createdAt: 'DESC' },
      relations: ['usuario', 'cliente'],
    });
  }

  async findAll(systemId: string, {
    usuario_id,
    cliente_id,
  }: UsuarioQueryDto & ClienteQueryDto, { page, limit }: PaginationDto): Promise<Contato[]> {
    const entityManager = this.loadEntityManager(systemId);

    let where = [];
    if (usuario_id) {
      where.push({ usuario: { id: usuario_id } });
    }
    if (cliente_id) {
      where.push({ cliente: { id: cliente_id } });
    }

    let limit_page = {};
    if (page && limit) {
      limit_page = {
        skip: (page - 1) * limit,
        take: limit
      }
    }

    return await entityManager.find(Contato, {
      where,
      ...limit_page,
      order: { fim: 'DESC' },
      // skip: (page - 1) * limit,
      // take: limit,
      relations: ['usuario', 'cliente'],
    });
  }

  async findOne(systemId: string, id: string): Promise<Contato> {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(Contato, {
      where: { id },
      relations: ['usuario', 'cliente'],
    });
  }

  async remove(systemId: string, id: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);
    const result = await entityManager.delete(Contato, { id });

    if (result.affected === 0) throw new InternalServerErrorException('Erro ao remover atendimento');

    return 'contato deletado com sucesso';
  }



  // gera um arquivo txt com os ids dos clientes de acordo com os ids de ocorrencia
  async getMetricas(systemId: string, {
    usuariosIds,
    from,
    to,
    na_base,
  }: { usuariosIds?: string[]; na_base?: boolean } & BetweenQueryDto) {
    const entityManager = this.loadEntityManager(systemId);

    const fromDate = from ? new Date(from) : subWeeks(new Date(), 1);
    const toDate = to ? addDays(new Date(to), 1) : new Date();

    let contatosQuery: any = {
      createdAt: Between(fromDate, toDate),
    };
    if (usuariosIds?.length) {
      contatosQuery.usuario = usuariosIds.map((id) => ({ id }));
    }
    if (typeof na_base === 'boolean') {
      contatosQuery.cliente = { na_base };
    }

    const contatos = await entityManager.find(Contato, {
      where: contatosQuery,
      relations: ['cliente', 'usuario'],
    });

    let clientesQuery: any = {};
    if (usuariosIds?.length) {
      clientesQuery.usuario = usuariosIds.map((id) => ({ id }));
    }
    if (typeof na_base === 'boolean') {
      clientesQuery.na_base = na_base;
    }
    const clientes = await entityManager.find(Cliente, { where: clientesQuery });

    // clientes únicos dentro dos contatos (o mais antigo por cliente)
    const clientesUnicosMapa = new Map<string, typeof contatos[0]>();
    contatos.filter(c => c.cliente != null).forEach(c => {
      const existente = clientesUnicosMapa.get(c.cliente.id);
      if (!existente || new Date(c.createdAt) < new Date(existente.createdAt)) {
        clientesUnicosMapa.set(c.cliente.id, c);
      }
    });

    let primeiro_contato = 0;
    if (from && to) {
      const rangeFrom = new Date(from);
      const rangeTo = new Date(to);
      clientesUnicosMapa.forEach((contato) => {
        if (contato.cliente?.primeiro_contato) {
          const d = new Date(contato.cliente.primeiro_contato);
          if (d >= rangeFrom && d <= rangeTo) primeiro_contato++;
        }
      });
    }

    // por ocorrência
    const ocorrenciaMap = new Map<string, { nome: string; contatos: typeof contatos }>();
    contatos.forEach(contato => {
      if (contato.ocorrencias?.length) {
        const oco = contato.ocorrencias[0];
        if (!ocorrenciaMap.has(oco.id)) {
          ocorrenciaMap.set(oco.id, { nome: oco.nome, contatos: [] });
        }
        ocorrenciaMap.get(oco.id).contatos.push(contato);
      }
    });

    const por_ocorrencia = Array.from(ocorrenciaMap.entries())
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([id, { nome, contatos: contatosOco }]) => {
        const duracao_total = contatosOco.reduce((sum, c) => {
          if (!c.inicio || !c.fim) return sum;
          return sum + calculateIntervalToSeconds(new Date(c.inicio), new Date(c.fim));
        }, 0);
        const clientes_unicos = new Set(
          contatosOco.filter(c => c.cliente).map(c => c.cliente.id)
        ).size;
        return {
          id,
          nome,
          quantidade_contatos: contatosOco.length,
          clientes_unicos,
          duracao_total_em_segundos: duracao_total,
          media_em_segundos: contatosOco.length > 0 ? duracao_total / contatosOco.length : 0,
        };
      });

    return {
      contatos: contatos.length,
      contatados: clientesUnicosMapa.size,
      total_clientes: clientes.length,
      primeiro_contato,
      nao_contatados: clientes.filter(c => !c.primeiro_contato).length,
      possiveis_clientes: clientes.filter(c => c.possivel_cliente === true).length,
      por_ocorrencia,
    };
  }

  async findAllTemp(systemId: string) {
    const entityManager = this.loadEntityManager(systemId);

    const contatos = await entityManager.find(Contato, {
      relations: ['cliente'],
    });

    // console.log('[] => ', contatos[0]);

    let clientes_contatos_filtrado = [];
    const ids_ocorrencias_a_filtrar = ['8', '17733364004864']; // ids das ocorrências que você deseja filtrar
    // const ids_ocorrencias_a_filtrar = ['2', '17733364004864', '8']; // ids das ocorrências que você deseja filtrar

    contatos.forEach((contato) => {
      const ids_ocorrencias_contato = contato.ocorrencias.map((oco) => oco.id);

      for (let index = 0; index < ids_ocorrencias_a_filtrar.length; index++) {
        const existe = ids_ocorrencias_contato.includes(ids_ocorrencias_a_filtrar[index])
        if (existe && contato.cliente) {
          clientes_contatos_filtrado.push(Number(contato.cliente.id))
        }
      }
    })

    const idsSemRepeticao = [...new Set(clientes_contatos_filtrado)];

    // console.log('[idsSemRepeticao.length] => ', idsSemRepeticao.length);

    fs.writeFileSync('fs/ids_clientes_ocorrencias.txt', idsSemRepeticao.join(','), 'utf8')

    return idsSemRepeticao.length
  }

  async exportCsv(systemId: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);

    const contatos = await entityManager.find(Contato, {
      relations: ['usuario', 'cliente', 'ocorrencias', 'funil'],
      withDeleted: false,
    });

    const header = [
      'id', 'inicio', 'fim', 'observacao',
      'cliente_id', 'cliente_nome',
      'usuario_id', 'usuario_nome',
      'funil', 'ocorrencias',
      'createdAt', 'updatedAt',
    ].join(',');

    const escape = (value: any) => {
      if (value == null) return '';
      const str = String(value).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    };

    const rows = contatos.map((c) => [
      escape(c.id),
      escape(c.inicio),
      escape(c.fim),
      escape(c.observacao),
      escape(c.cliente?.id),
      escape(c.cliente?.nome),
      escape(c.usuario?.id),
      escape(c.usuario?.nome),
      escape(c.funil?.nome ?? ''),
      escape(c.ocorrencias?.map((o) => o.nome).join(' | ')),
      escape(c.createdAt),
      escape(c.updatedAt),
    ].join(','));

    return [header, ...rows].join('\n');
  }

}

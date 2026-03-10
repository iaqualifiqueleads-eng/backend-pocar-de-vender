import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { ClienteService } from '../cliente/cliente.service';
import { Agendamento } from './entities/agendamento.entity';
import { ModuleRef } from '@nestjs/core';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { ClienteIdQueryDto } from 'src/common/dtos/cliente-id.dto';
import { UsuarioIdQueryDto } from 'src/common/dtos/usuario-id.dto';
import { addDays, isBefore, subWeeks } from "date-fns";
import { Cliente } from '../cliente/entities/cliente.entity';
import { BaseService } from '../shared/base-service';
import { BetweenQueryDto } from 'src/common/dtos/from-to.dto';
import { PossivelClienteQueryDto } from '../contato/dto/query-possivel-cliente.dto';
import { Between, FindOptionsWhere, IsNull, Not } from 'typeorm';

@Injectable()
export class AgendamentoService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly usuarioService: UsuarioService,

    @Inject(forwardRef(() => ClienteService))
    private readonly clienteService: ClienteService,
  ) {
    super(moduleRef);
  }

  private async updateProximoContatoDoCliente(systemId: string, clienteId: string, proximo_contato: Date | null) {
    const entityManager = this.loadEntityManager(systemId);

    await entityManager.update(Cliente, clienteId, {
      proximo_contato,
    });
  }

  async create(systemId: string, createAgendamentoDto: CreateAgendamentoDto) {
    const entityManager = this.loadEntityManager(systemId);
    const [cliente, usuario] = await Promise.all([
      this.clienteService.findOne(systemId, createAgendamentoDto.cliente),
      this.usuarioService.findOne(systemId, { id: createAgendamentoDto.usuario }),
    ]);

    if (!cliente) throw new NotFoundException('Cliente não encontrado');

    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const novoAgendamento = await entityManager.save(Agendamento,
      entityManager.create(Agendamento, {
        ...createAgendamentoDto,
        cliente,
        usuario,
      }),
    );

    const agendamentos = await this.findAll(systemId, { clienteId: cliente.id, limit: 1, page: 1 });

    await this.updateProximoContatoDoCliente(systemId, cliente.id, agendamentos.length > 0 ? agendamentos[0].date : null);

    return novoAgendamento
  }

  async findAll(systemId: string, { page = 1, limit = 1000, usuarioId, clienteId }: PaginationDto & UsuarioIdQueryDto & ClienteIdQueryDto) {
    const entityManager = this.loadEntityManager(systemId);

    let query = [];
    if (usuarioId) {
      query.push({ usuario: { id: usuarioId } })
    }

    if (clienteId) {
      query.push({ cliente: { id: clienteId } })
    }

    return await entityManager.find(Agendamento, {
      where: query,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['cliente', 'usuario'],
      order: { date: 'ASC' },
    });
  }

  async findRelatorio(systemId: string, { from, to, possivel_cliente, usuariosIds, limit = 100, page }: { usuariosIds?: string[] } & BetweenQueryDto & PossivelClienteQueryDto & PaginationDto) {
    const entityManager = this.loadEntityManager(systemId);

    from = from ?? subWeeks(new Date(), 1);
    to = to ?? new Date();

    const clienteWhere: FindOptionsWhere<any> = {
      // Garante que o cliente não seja nulo
      id: Not(IsNull()),
    };
    // 🔸 Filtro de data (from e to)
    if (from && to) {
      clienteWhere.proximo_contato = Between(new Date(from), addDays(new Date(to), 1));
    }
    // 🔸 Filtro de possível cliente
    if (possivel_cliente !== undefined) {
      clienteWhere.possivel_cliente = possivel_cliente === 'true';
    }

    // let where = [];
    let query: FindOptionsWhere<Agendamento> | FindOptionsWhere<Agendamento>[] = {
      cliente: clienteWhere
    };

    if (usuariosIds) {
      query = { ...query, usuario: usuariosIds?.map((id) => ({ id })) };
    }

    return await entityManager.find(Agendamento, {
      where: query,
      take: limit ?? 1000,
      order: { cliente: { proximo_contato: 'DESC' } },
      relations: ['cliente', 'usuario'],
    });

  }

  async findOne(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);
    return await entityManager.findOne(Agendamento, {
      where: { id },
      relations: ['cliente', 'usuario'],
    });
  }

  async update(systemId: string, id: string, updateAgendamentoDto: UpdateAgendamentoDto) {
    const entityManager = this.loadEntityManager(systemId);

    const result = await entityManager.update(Agendamento, id, {
      ...updateAgendamentoDto,
    });

    if (result.affected === 0)
      throw new NotFoundException('Erro ao atualizar agendamento');

    const agendamentoAtualizado = await this.findOne(systemId, id);

    const agendamentos = await this.findAll(systemId, { clienteId: agendamentoAtualizado.cliente.id, limit: 1, page: 1 });

    // atualiza proximo contato do cliente caso não exista ou seja antes do proximo contato
    if (agendamentos.length > 0 && agendamentos[0].cliente.proximo_contato === null || isBefore(agendamentos[0].date, agendamentos[0].cliente.proximo_contato)) {
      await this.updateProximoContatoDoCliente(systemId, agendamentos[0].cliente.id, agendamentos[0].date);
    }

    return agendamentoAtualizado
  }

  async remove(systemId: string, id: string) {
    const entityManager = this.loadEntityManager(systemId);

    const { cliente } = await this.findOne(systemId, id);

    const result = await entityManager.delete(Agendamento, { id });

    const agendamentos = await this.findAll(systemId, { clienteId: cliente.id, limit: 1, page: 1 });
    if (agendamentos.length === 0) {
      await this.updateProximoContatoDoCliente(systemId, cliente.id, null);
    } else {
      await this.updateProximoContatoDoCliente(systemId, cliente.id, agendamentos[0].date);
    }


    if (result.affected === 0)
      throw new NotFoundException('Erro ao remover agendamento');

    return 'Agendamento deletado com sucesso';
  }
}

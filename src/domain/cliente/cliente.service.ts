import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { Between, In, IsNull, Like, Not, Timestamp } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { ModuleRef } from '@nestjs/core';
import { Usuario } from '../usuario/entities/usuario.entity';
import { TelefoneService } from '../telefone/telefone.service';
import { EnderecoService } from '../endereco/endereco.service';
import { CreateManyClientesDto } from './dto/create-many-clientes.dto';
import { Telefone } from '../telefone/entities/telefone.entity';
import { Endereco } from '../endereco/entities/endereco.entity';
import { ClienteTransferirDto } from './dto/cliente-transferir.dto';
import { ClienteQueryDto } from './dto/cliente.query.dto';
import { BaseService } from '../shared/base-service';
import { AgendamentoService } from '../agendamento/agendamento.service';
import { Agendamento } from '../agendamento/entities/agendamento.entity';
import { DataToCreateTelefones } from './dto/create-telefones.dto';
import { Contato } from '../contato/entities/contato.entity';

export type DataToUpdate = {
  old_id: string,
  ddd: string,
  telefone_principal: string,
  telefones: {
    ddd: string,
    numero: string
  }[]
}

@Injectable()
export class ClienteService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
    private readonly usuarioService: UsuarioService,
    private readonly telefoneService: TelefoneService,
    private readonly enderecoService: EnderecoService,

    @Inject(forwardRef(() => AgendamentoService))
    private readonly agendamentoService: AgendamentoService,
  ) {
    super(moduleRef)
  }

  async exists(systemId: string, filter: { id?: string, email?: string, cnpj?: string }): Promise<boolean> {
    const entityManager = this.loadEntityManager(systemId);
    return !!(await entityManager.findOneBy(Cliente, filter));
  }

  async create(systemId: string, createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      const entityManager = this.loadEntityManager(systemId);
      const usuario = await this.usuarioService.findOne(systemId, { id: createClienteDto.usuario })

      if (createClienteDto.cnpj) {
        const existe = await this.exists(systemId, {
          cnpj: createClienteDto.cnpj,
        });

        if (existe) throw new BadRequestException('Cliente já cadastrado');
      }

      const cliente = entityManager.create(Cliente, {
        ...createClienteDto,
        usuario,
        telefones: [],
      })

      // cria telefones
      if (createClienteDto.telefones.length > 0) {
        const telefones = await Promise.all(createClienteDto.telefones.map(async (numero) => {
          return await this.telefoneService.create(systemId, { ddd: numero.ddd, numero: numero.numero })
        }))

        cliente.telefones = telefones
      }

      // cria endereco
      if (createClienteDto.endereco) {
        const endereco = await this.enderecoService.create(systemId, createClienteDto.endereco)
        cliente.endereco = endereco
      }

      const clientes = await entityManager.save(Cliente, cliente);

      return clientes
    } catch (error) {
      // console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  private async *createBatch(systemId: string, totalSize: number, createManyClientesDto: CreateClienteDto[]) {
    const entityManager = this.loadEntityManager(systemId);

    let count = 0;
    while (count < totalSize) {
      const batchClientes: Cliente[] = [];
      for (let i = 0; i < createManyClientesDto.length && count < totalSize; i++, count++) {
        let existe = await this.exists(systemId, { cnpj: createManyClientesDto[i].cnpj })

        if (createManyClientesDto[i].cnpj.length === 0) {
          existe = false
        }

        if (!existe) {
          const usuario = await entityManager.findOne(Usuario, { where: { id: createManyClientesDto[i].usuario } })

          const telefones = createManyClientesDto[i].telefones.map((numero) => {
            return entityManager.create(Telefone, {
              ...numero,
            })
          })

          const endereco = entityManager.create(Endereco, {
            ...createManyClientesDto[i].endereco,
          })

          const [telefonesSalvos, enderecoSalvo] = await Promise.all([
            entityManager.save(Telefone, telefones),
            entityManager.save(Endereco, endereco),
          ]);

          const cliente = entityManager.create(Cliente, {
            ...createManyClientesDto[i],
            usuario,
            telefones: telefonesSalvos,
            endereco: enderecoSalvo,
          })

          batchClientes.push(cliente)
        }
      }

      yield batchClientes
    }
  }

  async createMany(systemId: string, createClientesDto: CreateManyClientesDto) {
    try {
      const entityManager = this.loadEntityManager(systemId);
      const totalSize = createClientesDto.clientes.length;
      const batchSize = 5;

      await entityManager.transaction(async (manager) => {
        const clientes_salvos: Cliente[] = [];

        for (let i = 0; i < totalSize; i += batchSize) {
          const batchClientes = createClientesDto.clientes.slice(i, i + batchSize);
          for await (const batch of this.createBatch(systemId, batchClientes.length, batchClientes)) {
            const clientes = await manager.save(Cliente, batch);
            clientes_salvos.push(...clientes);
          }
        }

        for (const cliente of clientes_salvos) {
          if (cliente.proximo_contato) {
            const date = cliente.proximo_contato.toString();
            const time = cliente.proximo_contato ? new Date(cliente.proximo_contato).toISOString().slice(11, 5) : "00:00";

            // Não cria agendamento duplicado (mesmo cliente, data e horário)
            const jaExiste = await this.agendamentoService.agendamentoJaExiste(
              systemId,
              { clienteId: cliente.id, date, time },
              manager,
            );
            if (jaExiste) continue;

            await manager.save(Agendamento, manager.create(Agendamento, {
              cliente: cliente,
              usuario: cliente.usuario,
              date,
              time,
            }))
          }
        }
      });

      return "Clientes criados com sucesso.";
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Mapa clienteId -> última ocorrência (a do contato mais recente do cliente).
   * Mesma lógica da tabela /relatorios. Seleciona só as colunas necessárias para não
   * hidratar as entidades inteiras de contato/cliente.
   */
  private async ultimaOcorrenciaPorCliente(systemId: string): Promise<Map<string, { id: string; nome: string }>> {
    const entityManager = this.loadEntityManager(systemId);

    const contatos = await entityManager
      .createQueryBuilder(Contato, 'contato')
      .innerJoin('contato.cliente', 'cliente')
      .leftJoin('contato.ocorrencias', 'ocorrencia')
      .select(['contato.id', 'contato.createdAt', 'cliente.id', 'ocorrencia.id', 'ocorrencia.nome'])
      .orderBy('contato.createdAt', 'ASC')
      .getMany();

    // Ordenado ASC, então o último write no Map é sempre o contato mais recente do cliente
    const ultimaOcorrencia = new Map<string, { id: string; nome: string }>();
    for (const contato of contatos) {
      if (!contato.cliente) continue;
      const ocorrencia = contato.ocorrencias?.[0];
      if (ocorrencia) {
        ultimaOcorrencia.set(contato.cliente.id, { id: ocorrencia.id, nome: ocorrencia.nome });
      } else {
        ultimaOcorrencia.delete(contato.cliente.id);
      }
    }

    return ultimaOcorrencia;
  }

  async findAll(systemId: string, {
    page,
    limit,
    usuarioId,
    contatado,
    ocorrenciasIds,
  }: PaginationDto & ClienteQueryDto & { ocorrenciasIds?: string[] }): Promise<(Cliente & { ultima_ocorrencia: string | null })[]> {
    const entityManager = this.loadEntityManager(systemId);

    let query: any = {};
    if (usuarioId) query = { usuario: { id: usuarioId } }
    if (contatado != undefined) {
      if (contatado === "true") {
        query = { ...query, ultimo_contato: Not(IsNull()) }
      } else if (contatado == "false") {
        query = { ...query, ultimo_contato: IsNull() }
      }
    }

    const ultimaOcorrencia = await this.ultimaOcorrenciaPorCliente(systemId);

    if (ocorrenciasIds?.length) {
      const clienteIds: string[] = [];
      ultimaOcorrencia.forEach((ocorrencia, clienteId) => {
        if (ocorrenciasIds.includes(ocorrencia.id)) clienteIds.push(clienteId);
      });
      if (clienteIds.length === 0) return [];
      query = { ...query, id: In(clienteIds) };
    }

    const clientes = await entityManager.find(Cliente, {
      where: query,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['usuario', "produtos"],
    });

    return clientes.map((cliente) => Object.assign(cliente, {
      ultima_ocorrencia: ultimaOcorrencia.get(cliente.id)?.nome ?? null,
    }));
  }

  async findAllByUsuariosIds(systemId: string, usuariosIds: string[]): Promise<Cliente[]> {
    const entityManager = this.loadEntityManager(systemId);

    let query = {};
    if (usuariosIds) {
      query = { ...query, usuario: usuariosIds?.map((id) => ({ id })) };
    }

    return await entityManager.find(Cliente, {
      where: query,
      relations: ['usuario'],
    });
  }

  async updateAllClientesToPossivelClienteFalse(systemId: string) {
    const entityManager = this.loadEntityManager(systemId);

    const clientes = await entityManager.find(Cliente, {
      where: {
        usuario: { id: "5" },
        possivel_cliente: true,
      },
    });

    await entityManager.update(Cliente, clientes.map((cliente) => cliente.id), {
      possivel_cliente: false,
    });

    return await entityManager.count(Cliente, {
      where: {
        usuario: { id: "5" },
        possivel_cliente: true,
      },
    })
  }

  async findOne(systemId: string, id: string): Promise<Cliente> {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.findOne(Cliente, {
      where: { id },
      relations: ['usuario'],
    });
  }

  async update(systemId: string, id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const entityManager = this.loadEntityManager(systemId);

    const cliente = await this.findOne(systemId, id);

    const { telefones, endereco, ...data } = updateClienteDto;

    if (endereco.id != "") {
      const enderecoExiste = await this.enderecoService.findOne(systemId, endereco.id);
      if (endereco && enderecoExiste) {
        await this.enderecoService.update(systemId, endereco.id, endereco)
      }
    }

    if (endereco.id === "") {
      var novo_endereco = await entityManager.save(entityManager.create(Endereco, {
        cep: endereco.cep,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        localidade: endereco.localidade,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        uf: endereco.uf,
      }))
    }

    await entityManager.update(Cliente, id, {
      ...data,
      endereco: endereco.id === "" ? novo_endereco : endereco,
      usuario: cliente.usuario,
    });

    try {
      let telefonesDoCliente = [];
      if (telefones && telefones.length > 0) {
        telefonesDoCliente = await Promise.all(telefones.filter((telefone) => !telefone.id).map(async (numero) => {
          return await this.telefoneService.create(systemId, { ddd: numero.ddd, numero: numero.numero })
        }))

        await Promise.all(telefones.filter((telefone) => telefone.id).map(async (telefone) => {
          return await this.telefoneService.update(systemId, telefone)
        }))

        entityManager.save(Cliente, {
          ...data,
          usuario: cliente.usuario,
          telefones: [...telefonesDoCliente, ...cliente.telefones],
        })
      }
    } catch (error) {
      throw new InternalServerErrorException(`Erro interno ao atualizar cliente ${error.stack}`);
    }

    return await this.findOne(systemId, id);
  }

  async createTelefones(systemId: string, DataToCreateTelefones: DataToCreateTelefones) {
    const entityManager = this.loadEntityManager(systemId);

    let totalTelefones = 0
    for await (const { cliente_id, telefone } of DataToCreateTelefones.data) {
      const cliente = await this.findOne(systemId, cliente_id);

      if (cliente && cliente.telefones.length < 2) {
        const novo_telefone = await this.telefoneService.create(systemId, { ddd: telefone.ddd, numero: telefone.numero })

        if (!novo_telefone) {
          return "Erro ao criar telefone"
        }

        ++totalTelefones

        await entityManager.save(Cliente, {
          ...cliente,
          telefones: [...cliente.telefones, novo_telefone],
        })
      }
    }

    return `XD - ${totalTelefones}`
  }

  async tranferirClientes(systemId: string, clienteTransferirDto: ClienteTransferirDto): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);

    // Normaliza os ids: o CSV importado costuma trazer aspas, espaços e \r,
    // que faziam o UPDATE não casar com nenhuma linha silenciosamente.
    const clientesIds = [...new Set(
      clienteTransferirDto.clientesIds
        .map((id) => String(id ?? '').trim().replace(/^"|"$/g, ''))
        .filter((id) => id.length > 0),
    )];

    if (clientesIds.length === 0) {
      throw new BadRequestException('Nenhum ID de cliente válido foi enviado.');
    }

    const usuarioId = String(clienteTransferirDto.usuarioId).trim();
    const usuario = await entityManager.findOne(Usuario, { where: { id: usuarioId } });
    if (!usuario) {
      throw new NotFoundException(`Usuário ${usuarioId} não encontrado.`);
    }

    // Atualiza em lotes com IN (...) para não abrir uma query por cliente
    // (com 1000 clientes isso estourava o pool de conexões).
    const CHUNK_SIZE = 200;
    let atualizados = 0;

    for (let i = 0; i < clientesIds.length; i += CHUNK_SIZE) {
      const lote = clientesIds.slice(i, i + CHUNK_SIZE);
      const result = await entityManager.update(
        Cliente,
        { id: In(lote) },
        { usuario: { id: usuarioId } },
      );
      atualizados += result.affected ?? 0;
    }

    if (atualizados === 0) {
      throw new NotFoundException(
        `Nenhum cliente foi transferido: os ${clientesIds.length} ID(s) enviados não existem nesta base.`,
      );
    }

    if (atualizados < clientesIds.length) {
      return `${atualizados} de ${clientesIds.length} clientes transferidos. Os demais IDs não foram encontrados nesta base.`;
    }

    return `${atualizados} cliente(s) transferido(s) com sucesso.`;
  }

  async remove(systemId: string, id: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);

    const result = await entityManager.softDelete(Cliente, id);

    if (result.affected === 0)
      throw new NotFoundException('Erro ao remover cliente');

    return "Cliente removido com sucesso.";
  }

  async deleteForError(systemId: string) {

    const entityManager = this.loadEntityManager(systemId);

    const start = new Date('2025-04-15');
    const end = new Date('2025-04-16');
    // const start = new Date('2025-04-19');
    // const end = new Date('2025-04-20');

    const clientes = await entityManager.find(Cliente, {
      where: {
        createdAt: Between(start, end),
        usuario: { id: "10" },
      }
    });
    if (clientes.length === 0) return

    const affected = await entityManager.delete(Cliente, clientes.map((cliente) => cliente.id));


    return clientes.length;
  }

  async updateTelefone(systemId: string, data: DataToUpdate) {
    const entityManager = this.loadEntityManager(systemId);

    const cliente = await entityManager.findOne(Cliente, {
      where: {
        old_id: Number(data.old_id),
        ddd: '',
        telefone_principal: '',
      },
    });

    if (!cliente) return

    await entityManager.update(Cliente, cliente.id, {
      ddd: data.ddd,
      telefone_principal: data.telefone_principal,
    })

    const { telefones } = data;
    try {
      let telefonesDoCliente = cliente.telefones;
      if (telefones && telefones.length > 0) {
        const novosTelefones = await Promise.all(telefones.map(async (tel) => {
          return await this.telefoneService.create(systemId, { ddd: tel.ddd, numero: tel.numero })
        }))

        const telefonesSalvos = await entityManager.save(Telefone, novosTelefones);

        await entityManager.save(Cliente, {
          ...cliente,
          ddd: data.ddd,
          telefone_principal: data.telefone_principal,
          telefones: [...telefonesDoCliente, ...telefonesSalvos],
        })
      }
    } catch (error) {

      throw new InternalServerErrorException("Erro interno ao atualizar cliente");
    }

    return await this.findOne(systemId, cliente.id);
  }

  async clientesSemTelefone(systemId: string) {
    const entityManager = this.loadEntityManager(systemId);

    const clientes = await entityManager.find(Cliente, {
      where: {
        telefone_principal: "",
        old_id: Not(IsNull()),
      },
    });


    return {
      length: clientes.length,
      data: clientes
    };
  }

  async updateclientesNaBase(systemId: string, data: { itens: string }) {
    const entityManager = this.loadEntityManager(systemId);

    const CNPJs = data.itens.split(',')

    const clientes = await Promise.all(CNPJs.map(async (cnpj) => {
      return await entityManager.findOneBy(Cliente, { cnpj })
    }));

    const clientes_filtrados = clientes.filter((x) => !!x)

    return await Promise.all(clientes_filtrados.map(async (cli) => {
      // console.log('[] => ', `${cli.id}`);

      return await entityManager.update(Cliente, `${cli.id}`, {
        na_base: true
      });
    }))
  }

  async updateOrigemCliente(systemId: string, data: { itens: string }) {
    const entityManager = this.loadEntityManager(systemId);

    const CNPJs = data.itens.split(',')


    const clientes = await Promise.all(CNPJs.map(async (cnpj) => {
      return await entityManager.findOneBy(Cliente, { cnpj })
    }));

    const clientes_filtrados = clientes.filter((x) => !!x)


    return await Promise.all(clientes_filtrados.map(async (cli) => {
      // console.log('[origem gislene] => ', `${cli.cnpj}`);

      return await entityManager.update(Cliente, `${cli.id}`, {
        origem: "gislene"
      });
    }))
  }

  async deleteMany(systemId: string, data: { itens: string }) {
    const entityManager = this.loadEntityManager(systemId);

    const ids = data.itens.split(',')

    const results = await Promise.all(ids.map(async (id) => {
      return await entityManager.softDelete(Cliente, id);
    }))

    // console.log('[results.length] => ', results.length);
    return results.length
  }


  ///////////////////////////////////////////////////////////
  async updateUsuariosByCNPJ(systemId: string, data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    const entityManager = this.loadEntityManager(systemId);

    // console.log('[data.length] => ', data.length);
    const log_erros: any[] = []

    const results = await Promise.all(data.map(async (cliente) => {
      const usuario = await entityManager.findOneBy(Usuario, { id: cliente.vendedor });

      if (!usuario) {
        log_erros.push({
          cnpj: cliente.cnpj,
          vendedor: cliente.vendedor,
          erro: 'Usuario não encontrado',
        })
        return
      }

      return entityManager.update(Cliente, { cnpj: cliente.cnpj }, {
        usuario: usuario,
        // origem: cliente.origem,
        // na_base: true
      })
    }))

    // console.log('[] => ', log_erros);

    return results
  }

  async updateUsuariosByNome(systemId: string, data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    const entityManager = this.loadEntityManager(systemId);

    // console.log('[data.length] => ', data.length);
    const log_erros: any[] = []

    const results = await Promise.all(data.map(async (cliente) => {
      const usuario = await entityManager.findOneBy(Usuario, { id: cliente.vendedor });

      if (!usuario) {
        log_erros.push({
          nome: cliente.rotulos_de_linha,
          vendedor: cliente.vendedor,
          erro: 'Usuario não encontrado',
        })
        return
      }


      return entityManager.update(Cliente, { nome: cliente.rotulos_de_linha }, {
        usuario: usuario,
        origem: cliente.origem,
        na_base: true,

      })
    }))

    return results
  }

  async updateOrigemByNome(systemId: string, data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    const entityManager = this.loadEntityManager(systemId);

    // console.log('[updateOrigemByNome] => ');
    // console.log('[data.length] => ', data.length);

    const results = await Promise.all(data.map(async (cliente) => {
      return entityManager.update(Cliente, { nome: cliente.rotulos_de_linha }, {
        origem: cliente.origem
      })
    }))

    return results
  }

  async updateOrigemByCNPJ(systemId: string, data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    const entityManager = this.loadEntityManager(systemId);

    // console.log('[updateOrigemByCNPJ] => ');
    // console.log('[data.length] => ', data.length);

    const results = await Promise.all(data.map(async (cliente) => {
      return entityManager.update(Cliente, { cnpj: cliente.cnpj }, {
        origem: cliente.origem
      })
    }))

    return results
  }

  async cadastrarVarios(systemId: string, data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    const entityManager = this.loadEntityManager(systemId);

    // console.log('[cadastrarVarios] => ');
    // console.log('[data.length] => ', data.length);

    const results = await Promise.all(data.map(async (d) => {
      const usuario = await entityManager.findOneBy(Usuario, { id: d.vendedor });

      // const telefone =  await this.telefoneService.create(systemId, { ddd: "00", numero: "000000000" })


      const novo_cliente = entityManager.create(Cliente, {
        nome: d.rotulos_de_linha,
        origem: d.origem,
        cnpj: d.cnpj,
        usuario: usuario,
        // telefones: [telefone],
        ddd: "00",
        telefone_principal: "000000000"
      })

      // novo_cliente.telefones = [telefone]

      return await entityManager.save(Cliente, novo_cliente)
    }))

    // console.log('[results] => ', results);
    return results
  }

  async exportCsv(systemId: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);

    const [clientes, contatos] = await Promise.all([
      entityManager.find(Cliente, {
        relations: ['usuario', 'endereco'],
        withDeleted: false,
      }),
      entityManager.find(Contato, {
        relations: ['cliente', 'ocorrencias'],
        order: { fim: 'DESC' },
        withDeleted: false,
      }),
    ]);

    // mapa clienteId -> nome da última ocorrência
    const ultimaOcorrencia = new Map<string, string>();
    for (const contato of contatos) {
      if (!contato.cliente) continue;
      const clienteId = String(contato.cliente.id);
      if (!ultimaOcorrencia.has(clienteId) && contato.ocorrencias?.length > 0) {
        ultimaOcorrencia.set(clienteId, contato.ocorrencias[0].nome);
      }
    }

    const header = [
      'id', 'nome', 'cnpj', 'email', 'ddd', 'telefone_principal',
      'possivel_cliente', 'na_base', 'estocado', 'prefere_fornecedor_atual',
      'contato', 'contato2', 'contato3', 'concorrente', 'origem', 'tipo',
      'obs', 'preferencia_horario', 'aniversario', 'primeiro_contato',
      'ultimo_contato', 'proximo_contato', 'data_fundacao',
      'endereco_cep', 'endereco_uf', 'endereco_localidade', 'endereco_bairro',
      'endereco_logradouro', 'endereco_numero', 'endereco_complemento',
      'usuario_id', 'usuario_nome', 'ultima_ocorrencia', 'createdAt', 'updatedAt',
    ].join(',');

    const escape = (value: any) => {
      if (value == null) return '';
      const str = String(value).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    };

    const rows = clientes.map((c) => [
      escape(c.id), escape(c.nome), escape(c.cnpj), escape(c.email),
      escape(c.ddd), escape(c.telefone_principal),
      escape(c.possivel_cliente), escape(c.na_base), escape(c.estocado), escape(c.prefere_fornecedor_atual),
      escape(c.contato), escape(c.contato2), escape(c.contato3), escape(c.concorrente),
      escape(c.origem), escape(c.tipo), escape(c.obs), escape(c.preferencia_horario),
      escape(c.aniversario), escape(c.primeiro_contato), escape(c.ultimo_contato),
      escape(c.proximo_contato), escape(c.data_fundacao),
      escape(c.endereco?.cep), escape(c.endereco?.uf), escape(c.endereco?.localidade),
      escape(c.endereco?.bairro), escape(c.endereco?.logradouro), escape(c.endereco?.numero),
      escape(c.endereco?.complemento),
      escape(c.usuario?.id), escape(c.usuario?.nome),
      escape(ultimaOcorrencia.get(String(c.id)) ?? ''),
      escape(c.createdAt), escape(c.updatedAt),
    ].join(','));

    return [header, ...rows].join('\n');
  }

}

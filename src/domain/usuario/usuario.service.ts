import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { hashPassword } from 'src/utils/hash-password';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { ModuleRef } from '@nestjs/core';
import { Not } from 'typeorm';
import { UsuarioRoles } from './enums/usuario-roles.enum';
import { BaseService } from '../shared/base-service';
import { env } from 'src/config/env.config';

@Injectable()
export class UsuarioService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
  ) {
    super(moduleRef)
  }

  // async exists(systemId: string, filter: { id?: string, email?: string }): Promise<boolean> {
  //   const entityManager = this.loadEntityManager(systemId);
  //   return !!(await entityManager.findOneBy(Usuario, filter));
  // }

  async exists(filter: { id?: string, email?: string }): Promise<boolean> {
    let existe = false;

    for (const id of env.databaseSystemIds.split(';')) {
      const entityManager = this.loadEntityManager(id);
      existe = !!(await entityManager.findOneBy(Usuario, filter))
      if (existe) {
        break;
      }
    }

    return existe
  }

  async create(systemId: string, createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const entityManager = this.loadEntityManager(systemId);
    const emailExists = await this.exists({ email: createUsuarioDto.email });

    if (emailExists) {
      throw new BadRequestException('Email já cadastrado');
    }

    const usuario = entityManager.create(Usuario, createUsuarioDto);
    return await entityManager.save(Usuario, usuario);
  }

  async findAll(systemId: string, { page, limit }: PaginationDto): Promise<Usuario[]> {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.find(Usuario, {
      where: {
        role: Not(UsuarioRoles.DEV)
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(systemId: string, filter: { id?: string, email?: string }): Promise<Usuario | null> {
    const entityManager = this.loadEntityManager(systemId);

    return await entityManager.findOne(Usuario, { where: filter });
  }

  async update(systemId: string, id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
    const entityManager = this.loadEntityManager(systemId);
    const user = await this.findOne(systemId, { id });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const result = await entityManager.update(Usuario, id, {
      ...user,
      ...dto,
    });

    if (!result.affected) {
      throw new BadRequestException('Erro ao atualizar usuário');
    }

    return this.findOne(systemId, { id });
  }

  async updatePassword(systemId: string, id: string, pass: string): Promise<Usuario> {
    const entityManager = this.loadEntityManager(systemId);
    const user = await this.findOne(systemId, { id });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return await entityManager.save(Usuario, {
      ...user,
      senha: await hashPassword(pass),
    });
  }

  async remove(systemId: string, id: string): Promise<string> {
    const entityManager = this.loadEntityManager(systemId);
    const user = await this.findOne(systemId, { id });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    await entityManager.softDelete(Usuario, { id: id });

    return 'Usuário deletado com sucesso.';
  }
}

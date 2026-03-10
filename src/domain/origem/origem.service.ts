import { Injectable } from '@nestjs/common';
import { CreateOrigemDto } from './dto/create-origem.dto';
import { UpdateOrigemDto } from './dto/update-origem.dto';
import { ModuleRef } from '@nestjs/core';
import { BaseService } from '../shared/base-service';
import { Origem } from './entities/origem.entity';

@Injectable()
export class OrigemService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
  ) {
    super(moduleRef)
  }

  async create(systemId: string, createOrigemDto: CreateOrigemDto) {
    try {
      const entityManager = this.loadEntityManager(systemId);

      return await entityManager.save(
        entityManager.create(Origem, {
          ...createOrigemDto
        })
      )

    } catch (error) {
      throw error
    }
  }

  async findAll(systemId: string) {
    try {
      const entityManager = this.loadEntityManager(systemId);

      return await entityManager.find(Origem)

    } catch (error) {
      throw error
    }
  }

  async findOne(systemId: string, id: string) {
    try {
      const entityManager = this.loadEntityManager(systemId);

      return await entityManager.findOneBy(Origem, { id })

    } catch (error) {
      throw error
    }
  }

  async update(systemId: string, id: string, updateOrigemDto: UpdateOrigemDto) {
    try {
      const entityManager = this.loadEntityManager(systemId);

      const origemexiste = await this.findOne(systemId, id)

      if (!origemexiste) return

      await entityManager.update(Origem, id, { nome: updateOrigemDto.nome })
      
      return await this.findOne(systemId, id) 

    } catch (error) {
      throw error
    }
  }

  async remove(systemId: string, id: string) {
    try {
      const entityManager = this.loadEntityManager(systemId);

      const origemexiste = await this.findOne(systemId, id)

      if (!origemexiste) return

      return await entityManager.delete(Origem, id)

    } catch (error) {
      throw error
    }
  }
}

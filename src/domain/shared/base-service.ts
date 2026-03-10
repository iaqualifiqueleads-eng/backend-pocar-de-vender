import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { getEntityManagerToken } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";


@Injectable()
export class BaseService {
  protected moduleRef: ModuleRef; // Alterado para protected

  constructor(moduleRef: ModuleRef) {
    this.moduleRef = moduleRef; // Inicializa a propriedade
  }

  protected loadEntityManager(systemId: string): EntityManager {
    return this.moduleRef.get(getEntityManagerToken(`database-${systemId}`), {
      strict: false,
    });
  }
}
import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base-service";
import { ModuleRef } from "@nestjs/core";
import { LogsEntity } from "./entities/logs.entity";


@Injectable()
export class LogsErrorsService extends BaseService {
  constructor(
    moduleRef: ModuleRef,
  ) {
    super(moduleRef);
  }

  async create(systemId: string, data: any) {
    const entityManager = this.loadEntityManager(systemId);

    const error = { ...data }

    return await entityManager.save(LogsEntity, entityManager.create(LogsEntity, error))
  }
}
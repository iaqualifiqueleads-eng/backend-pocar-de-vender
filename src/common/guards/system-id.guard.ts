import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { env } from 'src/config/env.config';

@Injectable()
export class SystemIdGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const systemId = this.extractSystemIdFromHeader(request)?.toString();
    const systemIds = env.databaseSystemIds.split(';');

    if (systemId && !systemIds.includes(systemId)) {

      throw new UnauthorizedException(`ID do Sistema ${systemId} não encontrado.`);
    }

    // if (!systemId) {
    //    throw new UnauthorizedException("Header 'x-system-id' não encontrado.");
    // } else if (!systemIds.includes(systemId)) {
    //   throw new UnauthorizedException(`ID do Sistema ${systemId} não encontrado.`);
    // }

    try {
      request['systemId'] = systemId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractSystemIdFromHeader(request: Request): string | string[] | undefined {
    const systemId = request.headers['x-system-id'];

    return systemId
  }
}

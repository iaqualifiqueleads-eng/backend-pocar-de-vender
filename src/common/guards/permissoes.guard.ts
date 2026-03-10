import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Request } from 'express';
import { PermissaoDto } from '../dtos/permission.dto';
import { PERMISOES_KEY } from '../decorators/permissoes.decorator';

  
  @Injectable()
  export class PermissaoesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
  
      if (!request.user) {
        throw new ForbiddenException();
      }
  
      try {
        const permissoesNecessarias: PermissaoDto[] =
          this.reflector.getAllAndOverride(PERMISOES_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
  
        for (const permissoes of permissoesNecessarias) {
          const permissoesDoUsuario = request.user.permissions.find(
            (permUser) => permUser.resource === permissoes.resource,
          );
          if (!permissoesDoUsuario) throw new ForbiddenException();
  
          const todasAcoesDisponiveis = permissoes.action.every(
            (acaoNecessaria) =>
              permissoesDoUsuario.actions.includes(acaoNecessaria),
          );
          if (!todasAcoesDisponiveis) throw new ForbiddenException();
        }
  
        return true;
      } catch (error) {
        throw new ForbiddenException();
      }
    }
  }
  
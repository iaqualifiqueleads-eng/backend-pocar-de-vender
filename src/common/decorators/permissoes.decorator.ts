

import { SetMetadata } from '@nestjs/common';
import { PermissaoDto } from '../dtos/permission.dto';
export const PERMISOES_KEY = 'PERMISOES_KEY' as const;

export const Permisoes = (permisoes: PermissaoDto[]) =>
  SetMetadata(PERMISOES_KEY, permisoes);

import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsEnum,
} from 'class-validator';

import { PermissoesResource } from '../../domain/shared/enums/permissoes-resource.enum';
import { PermissoesActions } from '../../domain/shared/enums/permissoes-actions.enum';

export class PermissaoDto {
  @ApiProperty({
    type: PermissoesResource,
    enumName: 'PermissoesResource',
    enum: PermissoesResource,
    example: PermissoesResource.ENDERECO,
    description: 'Recurso que deseja criar a nova permissão',
  })
  @IsEnum(PermissoesResource)
  resource: PermissoesResource;

  @ApiProperty({
    type: [PermissoesActions],
    enumName: 'PermissoesActions',
    enum: PermissoesActions,
    example: [
      PermissoesActions.CREATE,
      PermissoesActions.READ,
      PermissoesActions.UPDATE,
    ],
    description: 'Ação que deseja criar a nova permissão',
  })
  @IsEnum(PermissoesActions, { each: true })
  @ArrayUnique()
  action: PermissoesActions[];
}

// export class CreatePermissionDto {
//   @ApiProperty({
//     type: String,
//     example: '34645645',
//     description: 'ID do usuário que deseja criar a nova permissão',
//   })
//   usuario: string;

//   @ApiProperty({
//     type: [PermissaoDto],
//     description: 'Ação que deseja criar a nova permissão',
//   })
//   @ValidateNested()
//   @IsArray()
//   @Type(() => PermissaoDto)
//   permisoes: PermissaoDto[];
// }

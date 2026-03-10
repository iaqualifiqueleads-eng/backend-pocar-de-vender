import { ApiProperty } from '@nestjs/swagger';
import { UsuarioRoles } from '../enums/usuario-roles.enum';
import { BaseResponseDto } from 'src/common/dtos/base.response.dto';

export class UsuarioResponseDto extends BaseResponseDto {
  @ApiProperty({
    type: String,
  })
  nome: string;

  @ApiProperty({
    type: String,
  })
  email: string;

  @ApiProperty({
    type: UsuarioRoles,
    enum: UsuarioRoles,
  })
  role: UsuarioRoles;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
  })
  telefone: string | null;
}

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UsuarioRoles } from 'src/domain/usuario/enums/usuario-roles.enum';

export class JwtDto {
  @IsString()
  sub: string;

  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(UsuarioRoles)
  role: UsuarioRoles;

  @IsNotEmpty()
  @IsString()
  systemId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UsuarioRoles } from 'src/domain/usuario/enums/usuario-roles.enum';

export class CreateUsuarioDto {
  @ApiProperty({
    type: String,
    example: 'Usuario',
    description: 'Nome do usuário',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  readonly nome: string;

  @ApiProperty({
    type: String,
    example: 'joao@gmail.com',
    description: 'Email do usuário',
    required: true,
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({
    type: String,
    example: '123456',
    description: 'Senha do usuário',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  @IsString()
  readonly senha: string;

  @ApiProperty({
    type: String,
    example: '123456',
    description: 'Confirmar senha do usuário',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(50)
  @IsString()
  readonly confirmarSenha: string;

  @ApiProperty({
    type: String,
    example: UsuarioRoles.FUNCIONARIO,
    description: 'Role do usuário',
    required: true,
  })
  @IsEnum(UsuarioRoles)
  readonly role: UsuarioRoles;
}

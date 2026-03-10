import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SinginAuthDto {
  @ApiProperty({ type: 'string', example: 'default@gmail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: '123456', required: true })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(50, { message: 'Senha deve ter no máximo 50 caracteres' })
  senha: string;
}

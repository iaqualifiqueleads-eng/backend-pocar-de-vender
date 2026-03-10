import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
  @ApiProperty({
    type: String,
    example: 'Usuario',
    description: 'Nome do usuário',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly nome?: string;


}

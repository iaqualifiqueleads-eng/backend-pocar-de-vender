import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UsuarioQueryDto {
  @ApiProperty({
    type: String,
    description: 'Usuario ID',
    required: false,
    name: 'usuario_id',
  })
  @IsString()
  @IsOptional()
  public readonly usuario_id?: string;
}
export class ClienteQueryDto {
  @ApiProperty({
    type: String,
    description: 'Cliente ID',
    required: false,
    name: 'cliente_id',
  })
  @IsString()
  @IsOptional()
  public readonly cliente_id?: string;
}
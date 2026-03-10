import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UsuarioIdQueryDto {
  @ApiProperty({
    description: 'Usuario ID',
    required: false,
    name: 'usuarioId',
  })
  @IsString()
  @IsOptional()
  public readonly usuarioId?: string;
}
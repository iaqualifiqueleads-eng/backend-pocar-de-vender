

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UsuariosIdsQueryDto {
  @ApiProperty({
    description: 'IDs a serem filtrados, separados por vírgula',
    required: false,
    type: String, // Especifica que é um array de strings
  })
  @IsString() // Valida que cada item é uma string
  @IsOptional()
  public readonly usuariosIds?: string;
}
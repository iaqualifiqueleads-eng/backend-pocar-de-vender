import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsDefined, IsOptional, IsString } from "class-validator";

export class ClienteQueryDto {
  @ApiProperty({
    description: "Contatado",
    required: false,
    name: "contatado",
    type: String,
  })
  @IsOptional()
  @IsBooleanString()
  @IsDefined()
  public readonly contatado?: "true" | "false" | undefined;

  @ApiProperty({
    description: 'Usuario ID',
    required: false,
    name: 'usuarioId',
  })
  @IsString()
  @IsOptional()
  public readonly usuarioId?: string;
}
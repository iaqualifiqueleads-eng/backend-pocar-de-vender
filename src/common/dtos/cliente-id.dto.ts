import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class ClienteIdQueryDto {
  @ApiProperty({
    description: 'Cliente ID',
    required: false,
    name: 'clienteId',
  })
  @IsString()
  @IsOptional()
  public readonly clienteId?: string;
}
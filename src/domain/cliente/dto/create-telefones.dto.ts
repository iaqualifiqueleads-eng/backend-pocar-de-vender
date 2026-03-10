import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";


class Telefone {
  @ApiProperty({
    type: String,
    example: '27',
  })
  @IsString()
  ddd: string;

  @ApiProperty({
    type: String,
    example: '33221100',
  })
  @IsString()
  numero: string
}

class CreateTelefone {
  @ApiProperty({
    type: String,
    example: '123456',
    description: 'ID do cliente',
    required: true,
  })
  @IsString()
  cliente_id: string;

  @ApiProperty({
    type: String,
    example: '123456',
    description: 'OLD ID do cliente',
    required: true,
  })
  @IsString()
  cliente_old_id: string;

  @ApiProperty({
    type: Telefone,
  })
  @Type(() => Telefone)
  telefone: Telefone;
}

export class DataToCreateTelefones {
  @ApiProperty({
    type: [CreateTelefone],
    example: CreateTelefone,
    description: 'Telefones',
    required: true,
  })
  @Type(() => CreateTelefone)
  @IsArray()
  data: CreateTelefone[];
}
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNumberString, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";

export class ClienteOrigemTransferirDto {
  @ApiProperty({ type: String, example: '1234567890', description: 'ID do Cliente' })
  @IsString()
  clienteId: string;

  @ApiProperty({ type: String, example: 'Indicação', description: 'Nova origem do cliente' })
  @IsString()
  @MaxLength(150)
  origem: string;
}

export class ClienteTransferirDto {
  @ApiProperty({
    type: String,
    example: '1234567890',
    description: 'ID do Cliente',
    required: true,
  })
  @IsNumberString()
  usuarioId: string;

  @ApiProperty({
    type: [String],
    example: ['1234567890', '1234567891'],
    description: 'IDs dos Clientes',
    required: true,
  })
  @IsArray()
  clientesIds: string[];

  @ApiProperty({
    type: [ClienteOrigemTransferirDto],
    description: 'Origens a atualizar junto com a transferência. Origens vazias são ignoradas.',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClienteOrigemTransferirDto)
  origens?: ClienteOrigemTransferirDto[];
}

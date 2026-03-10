import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumberString } from "class-validator";

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
}
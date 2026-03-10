

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class PossivelClienteQueryDto {
  @ApiProperty({
    type: String,
    example: 'true',
    required: false,
    name: "possivel_cliente",
  })
  @IsString()
  @IsOptional()
  @Matches(/^(true|false)$/, {
    message: 'Value must be a boolean string (true or false)',
  })
  possivel_cliente?: "true" | "false" | undefined;
}
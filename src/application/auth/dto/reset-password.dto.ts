

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    description: 'ID do usuário',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}

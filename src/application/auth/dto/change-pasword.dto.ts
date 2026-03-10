import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    description: 'ID do usuário',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'Senha atual do usuário',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly currentPassword: string;

  @ApiProperty({
    type: String,
    description: 'Nova senha do usuário',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly newPassword: string;
}

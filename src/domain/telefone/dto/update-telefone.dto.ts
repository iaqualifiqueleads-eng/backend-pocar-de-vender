import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, MaxLength, MinLength } from 'class-validator';

export class UpdateTelefoneDto {
  @ApiProperty({
    type: String,
    example: '93476534654',
    description: 'ID do telefone',
    required: true,
  })
  @IsNumberString()
  id: string;

  @ApiProperty({
    type: String,
    example: '27',
    description: 'DDD do telefone',
    required: true,
  })
  @IsNumberString()
  @MinLength(2)
  @MaxLength(2)
  ddd: string;

  @ApiProperty({
    type: String,
    example: '32426141',
    description: 'Numero do telefone',
    required: true,
  })
  @IsNumberString()
  @MinLength(8)
  @MaxLength(9)
  numero: string;

}

import { ApiProperty } from '@nestjs/swagger';
import { CreateEnderecoDto } from './create-endereco.dto';
import { IsNumberString } from 'class-validator';

export class UpdateEnderecoDto extends CreateEnderecoDto {
  @ApiProperty({
    type: String,
    example: '45645645',
    description: 'ID',
    required: true,
  })
  @IsNumberString()
  id: string;
}

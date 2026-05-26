
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateEnderecoDto } from 'src/domain/endereco/dto/create-endereco.dto';

export class CreateClienteByAiDto {
  @ApiProperty({
    type: String,
    example: '123456',
    description: 'ID do usuario',
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  usuario?: string;

  @ApiProperty({
    type: CreateEnderecoDto,
    description: 'Endereço do cliente',
    required: false,
  })
  @Type(() => CreateEnderecoDto)
  @IsOptional()
  endereco?: CreateEnderecoDto;

  @ApiProperty({ type: Boolean, example: true, description: 'Possível Cliente', required: true })
  @IsBoolean()
  possivel_cliente: boolean;

  @ApiProperty({
    type: String,
    example: 'Cliente A',
    description: 'Nome do cliente',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    type: String,
    example: '75173743000162',
    description: 'CNPJ do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cnpj?: string;

  @ApiProperty({
    type: String,
    example: '32426141',
    description: 'Telefone Principal',
    required: true,
  })
  // @IsNumberString()
  // @MinLength(8)
  // @MaxLength(9)
  telefone_principal: string;

  @ApiProperty({
    type: String,
    example: 'Origem Do Cliente',
    description: 'Origem do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  origem?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateEnderecoDto } from 'src/domain/endereco/dto/create-endereco.dto';
import { CreateTelefoneDto } from 'src/domain/telefone/dto/create-telefone.dto';
import { Timestamp } from 'typeorm';

export class CreateClienteDto {
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
  cnpj?: string;

  @ApiProperty({
    type: String,
    example: 'cliente@email.com',
    description: 'Email do cliente',
    required: false,
  })
  // @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '27',
    description: 'DDD do cliente',
    required: true,
  })
  // @IsNumberString()
  // @MinLength(2)
  // @MaxLength(2)
  ddd: string;

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
    type: [CreateTelefoneDto],
    example: CreateTelefoneDto,
    description: 'Telefones',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Type(() => CreateTelefoneDto)
  telefones?: CreateTelefoneDto[];

  @ApiProperty({
    type: Timestamp,
    example: '13:15',
    description: 'Horario de preferencia',
    required: false,
  })
  @IsMilitaryTime()
  @IsOptional()
  preferencia_horario?: string;

  @ApiProperty({
    type: Timestamp,
    example: '2024-12-03',
    description: 'Data do primeiro contato',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  primeiro_contato?: Date;

  @ApiProperty({
    type: Timestamp,
    example: '2024-12-03',
    description: 'Data do proximo contato',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  proximo_contato?: Date;

  @ApiProperty({
    type: Timestamp,
    example: '2024-12-03',
    description: 'Data de aniversário',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  aniversario?: Date;

  @ApiProperty({
    type: Timestamp,
    example: '2024-12-03',
    description: 'Data de fundação',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  data_fundacao?: Date;

  @ApiProperty({
    type: String,
    example: 'Origem Do Cliente',
    description: 'Origem do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  origem?: string;

  @ApiProperty({
    type: String,
    example: 'Tipo Do Cliente',
    description: 'tipo do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiProperty({
    type: String,
    example: 'Observações Do Cliente',
    description: 'Observações do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  obs?: string;

  @ApiProperty({
    type: String,
    example: 'Contato Do Cliente',
    description: 'Contato do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  contato?: string;

  @ApiProperty({
    type: String,
    example: 'Contato Do Cliente',
    description: 'Contato do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  contato2?: string;

  @ApiProperty({
    type: String,
    example: 'Contato Do Cliente',
    description: 'Contato do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  contato3?: string;

  @ApiProperty({
    type: String,
    example: 'Concorrente Do Cliente',
    description: 'concorrente do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  concorrente?: string;
}

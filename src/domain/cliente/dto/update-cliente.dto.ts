import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { UpdateEnderecoDto } from 'src/domain/endereco/dto/update-endereco.dto';
import { UpdateTelefoneDto } from 'src/domain/telefone/dto/update-telefone.dto';
import { Timestamp } from 'typeorm';

export class UpdateClienteDto {
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
    type: String,
    example: 'Cliente A',
    description: 'Nome do cliente',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ type: Boolean, example: true, description: 'Possível Cliente' })
  @IsBoolean()
  @IsOptional()
  possivel_cliente: boolean;

  @ApiProperty({
    type: String,
    example: '75173743000162',
    description: 'CNPJ do cliente',
    required: false,
  })
  @IsString()
  @IsOptional()
  cnpj: string;

  @ApiProperty({
    type: String,
    example: 'cliente@email.com',
    description: 'Email do cliente',
    required: false,
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    example: '32426141',
    description: 'Telefone Principal',
    required: true,
  })
  @IsString()
  @Length(2, 2)
  ddd: string;

  @ApiProperty({
    type: String,
    example: '32426141',
    description: 'Telefone Principal',
    required: false,
  })
  @IsString()
  @Length(8, 12, { message: 'Telefone inválido' })
  telefone_principal: string;

  @ApiProperty({
    type: [UpdateTelefoneDto],
    example: UpdateTelefoneDto,
    description: 'Telefones',
    required: false,
  })
  @Type(() => UpdateTelefoneDto)
  telefones?: UpdateTelefoneDto[];

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
  proximo_contato?: Date | null;

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
    description: 'Tipo do cliente',
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

  @ApiProperty({
    type: UpdateEnderecoDto,
    description: 'ID',
    required: false,
  })
  @Type(() => UpdateEnderecoDto)
  endereco?: UpdateEnderecoDto;
}

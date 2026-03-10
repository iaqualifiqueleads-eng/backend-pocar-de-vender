import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsBoolean, IsDateString, IsMilitaryTime, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { CreateAgendamentoDto } from 'src/domain/agendamento/dto/create-agendamento.dto';
import { Timestamp } from 'typeorm';

class OcorrenciaId {
  @ApiProperty({ type: String, example: '789' })
  @IsString()
  id: string;
}

class ProdutoId {
  @ApiProperty({ type: String, example: '012' })
  @IsString()
  id: string;
}

export class CreateContato {
  @ApiProperty({ type: CreateAgendamentoDto, required: false })
  @Type(() => CreateAgendamentoDto)
  agendamento?: CreateAgendamentoDto

  // @ApiProperty({ type: Date })
  // @IsDateString()
  // fim: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  inicio: Date;

  // @ApiProperty({ type: Date })
  // @IsDateString()
  // fim: Date;

  @ApiProperty({ type: String, example: '000', required: false })
  @IsString()
  @IsOptional()
  funil: string;

  @ApiProperty({ type: String, example: '123' })
  @IsString()
  usuario: string;

  @ApiProperty({ type: String, example: '456' })
  @IsString()
  cliente: string;

  @ApiProperty({ type: [String], example: [{ id: '789' }] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OcorrenciaId)
  ocorrencias: OcorrenciaId[];

  @ApiProperty({ type: [String], example: [{ id: '789' }] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProdutoId)
  produtos: ProdutoId[];

  @ApiProperty({ type: String, example: 'observacao', required: false })
  @IsString()
  @IsOptional()
  observacao: string | null;

  @ApiProperty({ type: Boolean, example: true, required: false })
  @IsBoolean()
  @IsOptional()
  nao_retornar: boolean | undefined;
}

import { ApiProperty } from '@nestjs/swagger';

export class OcorrenciaMetricaDto {
  @ApiProperty() id: string;
  @ApiProperty() nome: string;
  @ApiProperty() quantidade_contatos: number;
  @ApiProperty() clientes_unicos: number;
  @ApiProperty() duracao_total_em_segundos: number;
  @ApiProperty() media_em_segundos: number;
}

export class UltimaOcorrenciaMetricaDto {
  @ApiProperty() id: string;
  @ApiProperty() nome: string;
  @ApiProperty() clientes: number;
}

export class ClienteUltimaOcorrenciaDto {
  @ApiProperty() id: string;
  @ApiProperty() nome: string;
  @ApiProperty() ddd: string;
  @ApiProperty() telefone_principal: string;
  @ApiProperty() na_base: boolean;
  @ApiProperty() ultimo_contato: Date;
  @ApiProperty({ nullable: true }) usuario_id: string | null;
  @ApiProperty({ nullable: true }) usuario_nome: string | null;
  @ApiProperty({ type: [String] }) ocorrencias: string[];
}

export class MetricasResponseDto {
  @ApiProperty() contatos: number;
  @ApiProperty() contatados: number;
  @ApiProperty() total_clientes: number;
  @ApiProperty() primeiro_contato: number;
  @ApiProperty() nao_contatados: number;
  @ApiProperty() possiveis_clientes: number;
  @ApiProperty({ type: [OcorrenciaMetricaDto] }) por_ocorrencia: OcorrenciaMetricaDto[];
  @ApiProperty({ type: [UltimaOcorrenciaMetricaDto] }) por_ultima_ocorrencia: UltimaOcorrenciaMetricaDto[];
}

import { ApiProperty } from '@nestjs/swagger';

export class OcorrenciaMetricaDto {
  @ApiProperty() id: string;
  @ApiProperty() nome: string;
  @ApiProperty() quantidade_contatos: number;
  @ApiProperty() clientes_unicos: number;
  @ApiProperty() duracao_total_em_segundos: number;
  @ApiProperty() media_em_segundos: number;
}

export class MetricasResponseDto {
  @ApiProperty() contatos: number;
  @ApiProperty() contatados: number;
  @ApiProperty() total_clientes: number;
  @ApiProperty() primeiro_contato: number;
  @ApiProperty() nao_contatados: number;
  @ApiProperty() possiveis_clientes: number;
  @ApiProperty({ type: [OcorrenciaMetricaDto] }) por_ocorrencia: OcorrenciaMetricaDto[];
}

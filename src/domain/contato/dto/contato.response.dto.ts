import { ApiProperty } from '@nestjs/swagger';
import { ClienteResponseDto } from 'src/domain/cliente/dto/cliente.response.dto';
import { OcorrenciaResponseDto } from 'src/domain/ocorrencia/dto/ocorrencia.response.dto';
import { UsuarioResponseDto } from 'src/domain/usuario/dto/usuario.response.dto';

export class ContatoResponseDto {
  @ApiProperty({ type: UsuarioResponseDto })
  usuario: UsuarioResponseDto;

  @ApiProperty({ type: ClienteResponseDto })
  cliente: ClienteResponseDto;

  @ApiProperty({ type: OcorrenciaResponseDto })
  ocorrencia: OcorrenciaResponseDto;

  @ApiProperty({ type: String })
  observacao: string | null;

  @ApiProperty({ type: String })
  deletedAt: string | null;
}

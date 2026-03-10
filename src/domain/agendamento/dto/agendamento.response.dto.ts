import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dtos/base.response.dto';
import { ClienteResponseDto } from 'src/domain/cliente/dto/cliente.response.dto';
import { UsuarioResponseDto } from 'src/domain/usuario/dto/usuario.response.dto';

export class AgendamentoResponseDto extends BaseResponseDto {
  @ApiProperty({
    type: String,
  })
  date: string;

  @ApiProperty({
    type: String,
  })
  time: string;

  @ApiProperty({
    type: ClienteResponseDto,
  })
  cliente: ClienteResponseDto;

  @ApiProperty({
    type: UsuarioResponseDto,
  })
  usuario: UsuarioResponseDto;
}

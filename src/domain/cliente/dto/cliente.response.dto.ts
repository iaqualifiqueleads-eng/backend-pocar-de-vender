import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dtos/base.response.dto';
import { EnderecoResponseDto } from 'src/domain/endereco/dto/endereco.response.dto';
import { ProdutoResponseDto } from 'src/domain/produto/dto/produto.response.dto';
import { TelefoneResponseDto } from 'src/domain/telefone/dto/telefone.response.dto';
import { UsuarioResponseDto } from 'src/domain/usuario/dto/usuario.response.dto';

export class ClienteBaseResponse extends BaseResponseDto {
  @ApiProperty({ type: String })
  nome: string;

  @ApiProperty({ type: Boolean })
  possivel_cliente: boolean;

  @ApiProperty({ type: String })
  email: string | null;

  @ApiProperty({ type: String })
  cnpj: string | null;

  @ApiProperty({ type: String, nullable: true })
  preferencia_horario: string | null;

  @ApiProperty({ type: String, nullable: true })
  primeiro_contato: string | null;

  @ApiProperty({ type: String, nullable: true })
  proximo_contato: string | null;

  @ApiProperty({ type: String, nullable: true })
  aniversario: string | null;

  @ApiProperty({ type: String })
  ddd: string;

  @ApiProperty({ type: String })
  telefone_principal: string;

  @ApiProperty({ type: String, nullable: true })
  origem: string | null;

  @ApiProperty({ type: String, nullable: true })
  contato: string | null;

  @ApiProperty({ type: String, nullable: true })
  contato2: string | null;

  @ApiProperty({ type: String, nullable: true })
  contato3: string | null;

  @ApiProperty({ type: String, nullable: true })
  concorrente: string | null;

  @ApiProperty({ type: String, nullable: true })
  obs: string | null;
}

export class ClienteResponseDto extends ClienteBaseResponse {
  @ApiProperty({ type: EnderecoResponseDto })
  endereco: EnderecoResponseDto;

  @ApiProperty({ type: UsuarioResponseDto, nullable: true })
  usuario: UsuarioResponseDto;

  @ApiProperty({ type: [TelefoneResponseDto] })
  telefones: TelefoneResponseDto[];

  @ApiProperty({ type: [ProdutoResponseDto] })
  produtos: ProdutoResponseDto[];
}

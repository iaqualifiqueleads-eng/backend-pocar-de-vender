import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "src/common/dtos/base.response.dto";
import { EnderecoResponseDto } from "src/domain/endereco/dto/endereco.response.dto";
import { TelefoneResponseDto } from "src/domain/telefone/dto/telefone.response.dto";


export class FornecedorResponsedto extends BaseResponseDto {
    @ApiProperty({ type: String })
    nome: string;

    @ApiProperty({ type: EnderecoResponseDto })
    endereco: EnderecoResponseDto

    @ApiProperty({ type: [TelefoneResponseDto] })
    telefones: TelefoneResponseDto[]
}
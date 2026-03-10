import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "src/common/dtos/base.response.dto";


export class EnderecoResponseDto extends BaseResponseDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    cep: string;

    @ApiProperty({ type: String })
    uf: string;

    @ApiProperty({ type: String })
    localidade: string;

    @ApiProperty({ type: String })
    bairro: string;

    @ApiProperty({ type: String })
    logradouro: string;

    @ApiProperty({ type: String })
    numero: string;

    @ApiProperty({ type: String })
    complemento: string;
}
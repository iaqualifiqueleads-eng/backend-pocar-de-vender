import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "src/common/dtos/base.response.dto";


export class ProdutoResponseDto extends BaseResponseDto {
    @ApiProperty({ type: String })
    nome: string;

    @ApiProperty({ type: String })
    codigo: string;
}
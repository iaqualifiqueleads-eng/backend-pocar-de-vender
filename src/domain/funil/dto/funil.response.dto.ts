import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "src/common/dtos/base.response.dto";


export class FunilResponseDto extends BaseResponseDto {
    @ApiProperty({ type: String })
    nome: string;

    @ApiProperty({ type: String, nullable: true })
    descricao: string | null;

    @ApiProperty({ type: String, nullable: true })
    cor: string | null;
}
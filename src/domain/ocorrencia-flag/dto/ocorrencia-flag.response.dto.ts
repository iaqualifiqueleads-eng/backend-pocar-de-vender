import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "src/common/dtos/base.response.dto";


export class OcorrenciaFlagResponseDto extends BaseResponseDto {
    @ApiProperty({
        type: String,
    })
    nome: string;

    @ApiProperty({
        type: String,
        nullable: true,
    })
    cor: string | null;
}
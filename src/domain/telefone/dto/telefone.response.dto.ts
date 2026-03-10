import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "src/common/dtos/base.response.dto";

export class TelefoneResponseDto extends BaseResponseDto {
    @ApiProperty({ type: String })
    numero: string;
}


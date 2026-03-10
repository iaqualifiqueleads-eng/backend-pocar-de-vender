import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { IsString } from "class-validator";

export class CreateOcorrenciaFlagDto {
    @ApiProperty({
        type: String,
        example: 'Ocorrencia Flag',
        description: 'Nome do ocorrencia flag',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({
        type: String,
        example: '#c6ff8e',
        description: 'Cor do ocorrencia flag',
        required: false,
    })
    @IsString()
    @IsOptional()
    cor?: string;
}

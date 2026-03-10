import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFunilDto {
    @ApiProperty({
        type: String,
        example: 'Funil A',
        description: 'Nome do funil',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({
        type: String,
        example: 'Descrição do funil',
        description: 'Descrição do funil',
        required: false,
    })
    @IsString()
    @IsOptional()
    descricao?: string;

    @ApiProperty({
        type: String,
        example: '#c6ff8e',
        description: 'Cor do funil',
        required: false,
    })
    @IsString()
    @IsOptional()
    cor?: string;
}

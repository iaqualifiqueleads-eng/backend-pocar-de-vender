import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { EstadosDoBrasilSigla } from "src/domain/shared/enums/estados-do-brasil-sigla.enum";

export class CreateEnderecoDto {
    @ApiProperty({
        type: String,
        example: 'CEP Cliente',
        description: 'CEP do cliente',
        required: true,
    })
    @IsString()
    cep: string

    @ApiProperty({
        type: EstadosDoBrasilSigla,
        enum: EstadosDoBrasilSigla,
        example: EstadosDoBrasilSigla.ES,
        description: 'UF do cliente',
        required: false,
    })
    @IsOptional()
    @IsEnum(EstadosDoBrasilSigla)
    uf: EstadosDoBrasilSigla;


    @ApiProperty({
        type: String,
        example: 'Localidade Do Cliente',
        description: 'Cidade do cliente',
        required: true,
    })
    localidade: string;

    @ApiProperty({
        type: String,
        example: 'Bairro Do Cliente',
        description: 'Bairro do cliente',
        required: true,
    })
    bairro: string;

    @ApiProperty({
        type: String,
        example: 'Rua Do Cliente',
        description: 'Logradouro do cliente',
        required: true,
    })
    logradouro: string;

    @ApiProperty({
        type: String,
        example: 'Numero Do Cliente',
        description: 'Numero do cliente',
        required: false,
    })
    numero?: string;

    @ApiProperty({
        type: String,
        example: 'Complemento Do Cliente',
        description: 'Complemento do cliente',
        required: false,
    })
    complemento: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateEnderecoDto } from "src/domain/endereco/dto/create-endereco.dto";
import { CreateTelefoneDto } from "src/domain/telefone/dto/create-telefone.dto";

export class CreateFornecedorDto {
    @ApiProperty({ type: String, example: 'Fornecedor A' })
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({ type: CreateEnderecoDto })
    @Type(() => CreateEnderecoDto)
    endereco: CreateEnderecoDto

    @ApiProperty({
        type: [String],
        example: ['(84) 3242-6141', '(84) 3242-6141'],
        description: 'Telefones',
        required: false,
    })
    @IsArray()
    @IsOptional()
    @Type(() => CreateTelefoneDto)
    telefones?: CreateTelefoneDto[];
}

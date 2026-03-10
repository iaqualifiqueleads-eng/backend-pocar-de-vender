import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class FornecedorId {
    @ApiProperty({ type: String, example: '123' })
    @IsString()
    id: string;
}

export class CreateProdutoDto {
    @ApiProperty({ type: String, example: 'Produto A' })
    @IsString()
    @IsNotEmpty()
    nome: string

    @ApiProperty({ type: String, example: 'A1B2C3' })
    @IsString()
    @IsOptional()
    codigo: string

    @ApiProperty({ type: [String], example: [{ id: '123' }] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FornecedorId)
    fornecedores: FornecedorId[];
}

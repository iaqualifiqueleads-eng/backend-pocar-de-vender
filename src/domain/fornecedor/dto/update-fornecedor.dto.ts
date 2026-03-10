import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFornecedorDto {
    @ApiProperty({
        type: String,
        example: 'Nome do Fornecedor',
        description: 'Nome do Fornecedor',
        required: false,
    })
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    readonly nome?: string;
}

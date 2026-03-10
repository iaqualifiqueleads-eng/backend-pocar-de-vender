import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class QueryAgendamentoDto {
    @ApiProperty({
        description: 'Cliente ID',
        required: false,
        name: 'clienteId',
    })
    @IsString()
    @IsOptional()
    public readonly clienteId?: string;

    @ApiProperty({
        description: 'Usuario ID',
        required: false,
        name: 'usuarioId',
    })
    @IsString()
    @IsOptional()
    public readonly usuarioId?: string;
}
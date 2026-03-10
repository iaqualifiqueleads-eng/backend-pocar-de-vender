import { ApiProperty } from "@nestjs/swagger";
import { CreateClienteDto } from "./create-cliente.dto";

export class CreateManyClientesDto {
    @ApiProperty({ type: CreateClienteDto, isArray: true })
    clientes: CreateClienteDto[];
}
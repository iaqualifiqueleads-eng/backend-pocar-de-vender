import { Cliente } from "src/domain/cliente/entities/cliente.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Usuario } from "src/domain/usuario/entities/usuario.entity";
import { Entity, ManyToOne } from "typeorm";

@Entity('transferencia-cliente')
export class TransferenciaCliente extends AggregateRoot {
    @ManyToOne(() => Cliente, (cliente) => cliente)
    cliente: Cliente;

    @ManyToOne(() => Usuario, (usuario) => usuario)
    movito_por: Usuario;

    @ManyToOne(() => Usuario, (usuario) => usuario)
    movito_de: Usuario;

    @ManyToOne(() => Usuario, (usuario) => usuario)
    movito_para: Usuario;
}

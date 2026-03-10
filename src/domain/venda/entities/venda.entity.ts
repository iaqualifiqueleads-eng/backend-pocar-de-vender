import { Cliente } from "src/domain/cliente/entities/cliente.entity";
import { Produto } from "src/domain/produto/entities/produto.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Usuario } from "src/domain/usuario/entities/usuario.entity";
import { Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity('venda')
export class Venda extends AggregateRoot {
    @ManyToOne(() => Cliente, (cliente) => cliente)
    cliente: Cliente;

    @ManyToOne(() => Usuario, (usuario) => usuario)
    usuario: Usuario;

    @ManyToMany(() => Produto)
    @JoinTable()
    produtos: Produto[];
}

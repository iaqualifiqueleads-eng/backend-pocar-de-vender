import { Cliente } from "src/domain/cliente/entities/cliente.entity";
import { Funil } from "src/domain/funil/entities/funil.entity";
import { Produto } from "src/domain/produto/entities/produto.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Usuario } from "src/domain/usuario/entities/usuario.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity('perda')
export class Perda extends AggregateRoot {
    @ManyToOne(() => Cliente, (cliente) => cliente)
    cliente: Cliente;

    @ManyToOne(() => Usuario, (usuario) => usuario)
    usuario: Usuario;

    @ManyToOne(() => Funil, (funil) => funil)
    funil: Funil;

    @ManyToMany(() => Produto)
    @JoinTable()
    produtos: Produto[];

    @Column({ type: 'varchar', length: 100, nullable: true })
    observacao: string;
}

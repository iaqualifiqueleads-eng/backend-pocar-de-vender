import { Fornecedor } from "src/domain/fornecedor/entities/fornecedor.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity('produto')
export class Produto extends AggregateRoot {
    @Column({ type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    codigo: string;

    @ManyToMany(() => Fornecedor)
    @JoinTable()
    fornecedores: Fornecedor[];
}

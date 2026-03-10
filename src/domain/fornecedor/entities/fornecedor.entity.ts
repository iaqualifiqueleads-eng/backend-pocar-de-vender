import { Endereco } from "src/domain/endereco/entities/endereco.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Telefone } from "src/domain/telefone/entities/telefone.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne } from "typeorm";

@Entity('fornecedor')
export class Fornecedor extends AggregateRoot {
    @Column({ type: 'varchar', length: 100, nullable: false })
    nome: string;

    @OneToOne(() => Endereco, { nullable: true, eager: true })
    @JoinColumn()
    endereco?: Endereco

    @ManyToMany(() => Telefone, { eager: true })
    @JoinTable()
    telefones: Telefone[];
}

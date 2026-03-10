import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";

@Entity('funil')
export class Funil extends AggregateRoot {
    @Column({ type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    descricao: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    cor: string;
}

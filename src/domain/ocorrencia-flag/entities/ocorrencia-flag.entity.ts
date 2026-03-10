import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";

@Entity('ocorrencia-flag')
export class OcorrenciaFlag extends AggregateRoot {
    @Column({ type: 'varchar', length: 100, nullable: false })
    nome: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    cor: string;
}

import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";

@Entity('telefone')
export class Telefone extends AggregateRoot {
    @Column({ type: 'varchar', length: 255, nullable: false })
    ddd: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    numero: string;
}

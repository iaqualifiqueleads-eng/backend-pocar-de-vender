import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";


@Entity('origem')
export class Origem extends AggregateRoot {

  @Column({ type: 'varchar', length: 100, nullable: false, default: "" })
  nome: string;

}

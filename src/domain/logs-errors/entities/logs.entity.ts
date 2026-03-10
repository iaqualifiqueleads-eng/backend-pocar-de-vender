import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Column, Entity } from "typeorm";

@Entity('logs')
export class LogsEntity extends AggregateRoot {
  @Column({ type: 'json' })
  error: Object;
}
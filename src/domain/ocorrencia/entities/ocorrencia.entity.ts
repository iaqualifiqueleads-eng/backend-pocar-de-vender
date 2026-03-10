import { AggregateRoot } from 'src/domain/shared/aggregate-root';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { OcorrenciaFlag } from 'src/domain/ocorrencia-flag/entities/ocorrencia-flag.entity';

@Entity('ocorrencia')
export class Ocorrencia extends AggregateRoot {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  nome: string;

  @ManyToMany(() => OcorrenciaFlag, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  flags: OcorrenciaFlag[];
}

import { Ocorrencia } from "src/domain/ocorrencia/entities/ocorrencia.entity";
import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { Usuario } from "src/domain/usuario/entities/usuario.entity";
import { Column, Entity, ManyToOne, Unique } from "typeorm";

@Entity('metricas_usuario')
@Unique("usuario-ocorrencia", ["usuario", "ocorrencia"])
export class MetricasUsuario extends AggregateRoot {
  @ManyToOne(() => Usuario, (usuario) => usuario, { eager: true, onDelete: "CASCADE" })
  usuario: Usuario;

  @ManyToOne(() => Ocorrencia, (ocorrencia) => ocorrencia, { eager: true, onDelete: "CASCADE" })
  ocorrencia: Ocorrencia;

  @Column({ type: 'float', nullable: false, default: 0 })
  duracao_segundos: number;
}

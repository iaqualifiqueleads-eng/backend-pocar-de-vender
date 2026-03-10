import { Cliente } from 'src/domain/cliente/entities/cliente.entity';
import { AggregateRoot } from 'src/domain/shared/aggregate-root';
import { Usuario } from 'src/domain/usuario/entities/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, Timestamp } from 'typeorm';

@Entity('agendamento')
export class Agendamento extends AggregateRoot {
  @ManyToOne(() => Cliente, (cliente) => cliente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @ManyToOne(() => Usuario, (usuario) => usuario)
  usuario: Usuario;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'time', nullable: false })
  time: Date;
}

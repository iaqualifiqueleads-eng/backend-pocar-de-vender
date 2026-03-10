import { Cliente } from 'src/domain/cliente/entities/cliente.entity';
import { Funil } from 'src/domain/funil/entities/funil.entity';
import { Ocorrencia } from 'src/domain/ocorrencia/entities/ocorrencia.entity';
import { Produto } from 'src/domain/produto/entities/produto.entity';
import { AggregateRoot } from 'src/domain/shared/aggregate-root';
import { Usuario } from 'src/domain/usuario/entities/usuario.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity('contato')
export class Contato extends AggregateRoot {
  @ManyToOne(() => Usuario, (usuario) => usuario)
  usuario: Usuario;

  @ManyToOne(() => Cliente, (cliente) => cliente)
  cliente: Cliente;

  @ManyToMany(() => Ocorrencia, { eager: true })
  @JoinTable()
  ocorrencias: Ocorrencia[];

  @Column({ type: 'datetime', nullable: true })
  inicio: Date | null;

  @Column({ type: 'datetime', nullable: true })
  fim: Date | null;

  @Column({ type: 'varchar', nullable: true })
  observacao: string | null;



  @ManyToOne(() => Funil, (funil) => funil, { nullable: true, eager: true })
  funil: Funil;

  @ManyToMany(() => Produto, { eager: true })
  @JoinTable()
  produtos: Produto[];
}

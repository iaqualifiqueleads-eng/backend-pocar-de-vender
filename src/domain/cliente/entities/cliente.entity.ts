
import { Endereco } from 'src/domain/endereco/entities/endereco.entity';
import { Produto } from 'src/domain/produto/entities/produto.entity';
import { AggregateRoot } from 'src/domain/shared/aggregate-root';
import { Telefone } from 'src/domain/telefone/entities/telefone.entity';
import { Usuario } from 'src/domain/usuario/entities/usuario.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, Unique } from 'typeorm';

@Entity('cliente')
// @Unique("ddd-telefone_principal", ["ddd", "telefone_principal"])

export class Cliente extends AggregateRoot {
  @Column({ type: 'integer', nullable: true })
  old_id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario, { nullable: true, eager: true, onDelete: 'CASCADE' })
  usuario?: Usuario;

  @ManyToMany(() => Produto)
  @JoinTable()
  produtos: Produto[];

  @Column({ type: 'boolean', default: false })
  possivel_cliente: boolean;

  @Column({ type: 'boolean', default: false })
  na_base: boolean;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  ddd: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  telefone_principal: string;

  @ManyToMany(() => Telefone, { eager: true, cascade: true })
  @JoinTable()
  telefones?: Telefone[];

  @Column({ type: 'time', nullable: true })
  preferencia_horario?: string;

  @Column({ type: 'date', nullable: true })
  aniversario?: Date;

  @Column({ type: 'date', nullable: true })
  primeiro_contato?: Date;

  @Column({ type: 'datetime', nullable: true })
  ultimo_contato?: Date;

  @Column({ type: 'date', nullable: true })
  proximo_contato?: Date;

  @Column({ type: 'date', nullable: true })
  data_fundacao?: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  origem?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  tipo?: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  obs?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contato?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contato2?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contato3?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  concorrente?: string;

  @OneToOne(() => Endereco, { nullable: true, eager: true })
  @JoinColumn()
  endereco?: Endereco

  @BeforeInsert()
  @BeforeUpdate()
  limparCnpj() {
    if (this.cnpj) {
      this.cnpj = this.cnpj.replace(/\D/g, '');
    }
  }
}

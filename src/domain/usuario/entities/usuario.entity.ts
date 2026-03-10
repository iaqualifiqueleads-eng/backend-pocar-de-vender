import {
  BeforeInsert,
  Column,
  Entity,
} from 'typeorm';
import { UsuarioRoles } from '../enums/usuario-roles.enum';
import { hashPassword } from 'src/utils/hash-password';
import { AggregateRoot } from 'src/domain/shared/aggregate-root';

@Entity('usuario')
export class Usuario extends AggregateRoot {
  @Column({ type: 'varchar', length: 100, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  senha: string;

  @Column({ type: 'enum', enum: UsuarioRoles, nullable: false })
  role: UsuarioRoles;

  @BeforeInsert()
  protected async beforeInsert() {
    this.senha = await hashPassword(this.senha);
  }
}

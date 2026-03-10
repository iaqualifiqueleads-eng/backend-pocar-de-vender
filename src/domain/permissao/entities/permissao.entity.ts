import { PermissoesActions } from "src/domain/shared/enums/permissoes-actions.enum";
import { PermissoesResource } from "src/domain/shared/enums/permissoes-resource.enum";
import { Usuario } from "src/domain/usuario/entities/usuario.entity";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { AggregateRoot } from "src/domain/shared/aggregate-root";

@Entity('permissao')
@Index(['resource', 'action', 'usuario'], { unique: true })
export class Permissao extends AggregateRoot {
    @Column({ type: 'enum', enum: PermissoesResource, nullable: false })
    resource: PermissoesResource;

    @Column({ type: 'enum', enum: PermissoesActions })
    action: PermissoesActions;

    @ManyToOne(() => Usuario, (usuario) => usuario, {
        nullable: false,
    })
    usuario: Usuario;
}

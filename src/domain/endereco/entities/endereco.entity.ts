import { AggregateRoot } from "src/domain/shared/aggregate-root";
import { EstadosDoBrasilSigla } from "src/domain/shared/enums/estados-do-brasil-sigla.enum";
import { Column, Entity } from "typeorm";

@Entity('endereco')
export class Endereco extends AggregateRoot {

    @Column({ type: 'varchar', length: 100, nullable: true })
    cep: string;

    @Column({ type: 'enum', enum: EstadosDoBrasilSigla, nullable: true })
    uf: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    localidade: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    bairro: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    logradouro: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    numero?: string;

    @Column({ type: 'varchar', default: "", length: 255, nullable: true })
    complemento: string;
}

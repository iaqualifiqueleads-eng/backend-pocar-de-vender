
import { Request } from 'express';
// import { JwtDto } from 'src/application/auth/dto/jwt.dto';
import { UsuarioRoles } from 'src/domain/usuario/enums/usuario-roles.enum';

type T = {
    systemId: string;
    user: {
        sub: string;
        nome: string;
        email: string;
        role: UsuarioRoles;
    }
}

export type CustomRequest = T & Request


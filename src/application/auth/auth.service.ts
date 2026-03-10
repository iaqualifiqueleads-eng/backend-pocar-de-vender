import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SinginAuthDto } from './dto/singin-auth.dto';
import { UsuarioService } from 'src/domain/usuario/usuario.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from './dto/jwt.dto';
import { Usuario } from 'src/domain/usuario/entities/usuario.entity';
import { env } from 'src/config/env.config';
import { ChangePasswordDto } from './dto/change-pasword.dto';
import { LoginResponseDto } from './dto/login.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuarioService,
    private readonly jwtService: JwtService,
  ) { }

  async signIn({ systemId, singinAuthDto }: { systemId?: string, singinAuthDto: SinginAuthDto }): Promise<LoginResponseDto> {
    let usuario: Usuario;

    if (systemId) {
      usuario = await this.usuariosService.findOne(systemId, {
        email: singinAuthDto.email,
      });
    } else {
      for (const id of env.databaseSystemIds.split(';')) {
        usuario = await this.usuariosService.findOne(id, {
          email: singinAuthDto.email,
        });

        if (usuario) {
          systemId = id;
          break;
        }
      }
    }

    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    if (!(await compare(singinAuthDto.senha, usuario.senha))) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return {
      access_token: this.createToken({ usuario, systemId }),
    };
  }

  async changePassword(systemId: string, changePasswordDto: ChangePasswordDto): Promise<LoginResponseDto> {
    const usuario = await this.usuariosService.findOne(systemId,
      {
        id: changePasswordDto.id,
      }
    );
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');

    if (!(await compare(changePasswordDto.currentPassword, usuario.senha))) {
      throw new ForbiddenException('Senha inválida.');
    }

    await this.usuariosService.updatePassword(systemId,
      usuario.id,
      changePasswordDto.newPassword,
    );

    return await this.signIn({
      systemId,
      singinAuthDto: {
        email: usuario.email,
        senha: changePasswordDto.newPassword,
      }
    });
  }

  private createToken({ usuario, systemId }: { usuario: Usuario, systemId: string }): string {
    const payload: Partial<JwtDto> = {
      sub: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      systemId: systemId,
    };

    return this.jwtService.sign(payload, {
      expiresIn: env.jwtExpireIn,
      secret: env.jwtSecret,
    });
  }
}

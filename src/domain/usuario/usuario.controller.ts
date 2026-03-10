import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { UsuarioResponseDto } from './dto/usuario.response.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
// import { CustomRequest } from 'src/common/dtos/request.dto';
import { Request } from 'express';
import { CreateUsuarioDto } from 'src/domain/usuario/dto/create-usuario.dto';

@Controller('usuario')
@ApiTags('Usuário')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo usuário.' })
  @ApiCreatedResponse({
    type: UsuarioResponseDto,
  })
  create(@Req() req: Request, @Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(req['systemId'], createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista de usuários.' })
  @ApiOkResponse({
    type: [UsuarioResponseDto],
    description: 'Lista de usuários.',
  })
  findAll(@Req() req: Request, @Query() { page = 1, limit = 10 }: PaginationDto) {
    return this.usuarioService.findAll(req['systemId'], { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera dados do usuário pelo ID.' })
  @ApiOkResponse({
    type: UsuarioResponseDto,
    description: 'Dados do usuário.',
  })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const usuario = await this.usuarioService.findOne(req['systemId'], { id });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return usuario;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza dados do usuário.' })
  @ApiOkResponse({
    type: UsuarioResponseDto,
    description: 'Dados do usuário atualizado.',
  })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(req['systemId'], id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete usuário.' })
  @ApiOkResponse({ type: String, description: 'Usuário deletado com sucesso.' })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.usuarioService.remove(req['systemId'], id);
  }
}

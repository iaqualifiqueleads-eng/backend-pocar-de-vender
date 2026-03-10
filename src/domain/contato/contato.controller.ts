import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContatoService } from './contato.service';
import { CreateContato } from './dto/create-contato.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ContatoResponseDto } from './dto/contato.response.dto';
import {
  ClienteQueryDto,
  UsuarioQueryDto,
} from './dto/contato-query.dto';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Request } from 'express';
import { IdsQueryDto } from 'src/common/dtos/ids.dto';
import { BetweenQueryDto } from 'src/common/dtos/from-to.dto';
import { PossivelClienteQueryDto } from './dto/query-possivel-cliente.dto';
import { UsuariosIdsQueryDto } from './dto/usuario-ids.dto';

@Controller('contato')
@ApiTags('Contato')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class ContatoController {
  constructor(private readonly contatoService: ContatoService) { }

  @Post()
  @ApiOperation({ summary: 'Criar contato' })
  @ApiCreatedResponse({ type: ContatoResponseDto })
  create(@Req() req: Request, @Body() createAtendimentoDto: CreateContato) {
    return this.contatoService.create(req["systemId"], createAtendimentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar contatos' })
  @ApiOkResponse({ type: [ContatoResponseDto] })
  findAll(
    @Query()
    { usuario_id }: UsuarioQueryDto,
    @Query()
    { cliente_id }: ClienteQueryDto,
    @Req() req: Request,
    @Query() { page, limit }: PaginationDto,
  ) {
    return this.contatoService.findAll(req["systemId"], {
      usuario_id,
      cliente_id,
    }, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera contato pelo ID' })
  @ApiOkResponse({ type: ContatoResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.contatoService.findOne(req["systemId"], id);
  }

  @Get('/count/:usuario_id/:ocorrenciaId')
  @ApiOperation({ summary: 'Recupera contato pelo ID' })
  @ApiOkResponse({ type: ContatoResponseDto })
  count(
    @Req() req: Request,
    @Param('usuario_id') usuario_id: string,
    @Param('ocorrenciaId') ocorrenciaId: string
  ) {
    return this.contatoService.contosCount(req["systemId"], { usuario_id, ocorrenciaId });
  }

  @Get('relatorio/relatorio')
  @ApiOperation({ summary: 'Relatorios' })
  @ApiOkResponse({ type: ContatoResponseDto })
  @ApiQuery({ name: 'ids', required: false, type: String, description: 'IDs das ocorrencias a serem filtradas, separados por vírgula' })
  relatorio(
    @Req() req: Request,
    @Query() { usuario_id }: UsuarioQueryDto,
    @Query() { cliente_id }: ClienteQueryDto,
    @Query() { ids }: IdsQueryDto,
    @Query() { usuariosIds }: UsuariosIdsQueryDto,
    @Query() { from, to }: BetweenQueryDto,
    @Query() { possivel_cliente }: PossivelClienteQueryDto,
  ) {

    return this.contatoService.relatorio(req["systemId"], {
      cliente_id,
      usuario_id,
      ocorenciasIds: ids?.split(','),
      usuariosIds: usuariosIds?.split(','),
      from,
      to,
      possivel_cliente
    });
  }

  @Get("relatorio/relatorio-dashboard")
  relatorioDashboard(
    @Req() req: Request,
    @Query() { ids }: IdsQueryDto,
    @Query() { from, to }: BetweenQueryDto,
  ) {

    return this.contatoService.relatorioDashboard(req["systemId"], {
      usuariosIds: ids ? ids?.split(',') : [req.user["sub"]],
      from,
      to,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove contato' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.contatoService.remove(req["systemId"], id);
  }


  @Get('temp/temp')
  async findAllTemp(@Req() req: Request) {
    return this.contatoService.findAllTemp(req["systemId"])
  }
}

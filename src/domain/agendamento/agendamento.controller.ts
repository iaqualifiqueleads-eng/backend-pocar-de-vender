import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Logger,
} from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgendamentoResponseDto } from './dto/agendamento.response.dto';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
// import { Request } from 'src/common/dtos/request.dto';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { QueryAgendamentoDto } from './dto/query.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { Request } from 'express';
import { ClienteIdQueryDto } from 'src/common/dtos/cliente-id.dto';
import { UsuarioIdQueryDto } from 'src/common/dtos/usuario-id.dto';
import { UsuariosIdsQueryDto } from '../contato/dto/usuario-ids.dto';
import { BetweenQueryDto } from 'src/common/dtos/from-to.dto';
import { PossivelClienteQueryDto } from '../contato/dto/query-possivel-cliente.dto';

@Controller('agendamento')
@ApiTags('Agendamento')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) { }

  private logger = new Logger;

  @Post()
  @ApiOperation({ summary: 'Criar agendamento' })
  @ApiCreatedResponse({ type: AgendamentoResponseDto })
  create(@Req() req: Request, @Body() createAgendamentoDto: CreateAgendamentoDto) {
    return this.agendamentoService.create(req['systemId'], createAgendamentoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos' })
  @ApiOkResponse({ type: [AgendamentoResponseDto] })

  findAll(@Req() req: Request,
    @Query() { page = 1, limit = 1000 }: PaginationDto,
    // @Query() { clienteId, usuarioId }: QueryAgendamentoDto,
    @Query() { clienteId }: ClienteIdQueryDto,
    @Query() { usuarioId }: UsuarioIdQueryDto,
  ) {
    this.logger.verbose("[Agendamento Controller][Find All]");

    return this.agendamentoService.findAll(req['systemId'], { page, limit, usuarioId, clienteId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar agendamento' })
  @ApiOkResponse({ type: AgendamentoResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.agendamentoService.findOne(req['systemId'], id);
  }

  @Get('/relatorio/agendamentos')
  @ApiOperation({ summary: 'Consultar agendamentos relatorio' })
  @ApiOkResponse({ type: AgendamentoResponseDto })
  findRelatorio(
    @Req() req: Request,
    @Query() { usuariosIds }: UsuariosIdsQueryDto,
    @Query() { from, to }: BetweenQueryDto,
    @Query() { possivel_cliente }: PossivelClienteQueryDto,
    @Query() { page, limit }: PaginationDto,
  ) {
    this.logger.verbose("[Agendamento Controller][relatorio]");

    return this.agendamentoService.findRelatorio(
      req['systemId'],
      {
        usuariosIds: usuariosIds?.split(','),
        from,
        to,
        possivel_cliente
      }
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  @ApiOkResponse({ type: AgendamentoResponseDto })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAgendamentoDto: UpdateAgendamentoDto,
  ) {
    return this.agendamentoService.update(req['systemId'], id, updateAgendamentoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover agendamento' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.agendamentoService.remove(req['systemId'], id);
  }
}

import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { MetricasUsuarioService } from './metricas-usuario.service';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { UsuarioIdQueryDto } from 'src/common/dtos/usuario-id.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { OcorrenciaIdQueryDto } from 'src/common/dtos/ocorrencia-id.dto';
import { BetweenQueryDto } from 'src/common/dtos/from-to.dto';

@Controller('metricas-usuario')
@ApiTags('metricas-usuario')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class MetricasUsuarioController {
  constructor(private readonly metricasUsuarioService: MetricasUsuarioService) { }
  @Get()
  findAll(
    @Req() req: Request,
    @Query() { page = 1, limit = 10 }: PaginationDto,
    @Query() { usuarioId }: UsuarioIdQueryDto,
    @Query() { ocorrenciaId }: OcorrenciaIdQueryDto,
  ) {
    return this.metricasUsuarioService.findAll(req["systemId"], { usuarioId, ocorrenciaId, limit, page });
  }
}

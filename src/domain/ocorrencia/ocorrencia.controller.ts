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
} from '@nestjs/common';
import { OcorrenciaService } from './ocorrencia.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OcorrenciaResponseDto } from './dto/ocorrencia.response.dto';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('ocorrencia')
@ApiTags('Ocorrencias')
@ApiBearerAuth('JWT-auth')
@UseGuards(SystemIdGuard)
@UseGuards(JwtGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class OcorrenciaController {
  constructor(private readonly ocorrenciaService: OcorrenciaService) { }

  @Post()
  @ApiOperation({ summary: 'Criar Ocorrencia' })
  @ApiCreatedResponse({ type: OcorrenciaResponseDto })
  create(@Req() req: Request, @Body() createOcorrenciaDto: CreateOcorrenciaDto) {
    return this.ocorrenciaService.create(req['systemId'], createOcorrenciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista de Ocorrências' })
  @ApiOkResponse({ type: [OcorrenciaResponseDto] })
  findAll(@Req() req: Request, @Query() { page, limit }: PaginationDto) {
    return this.ocorrenciaService.findAll(req['systemId'], { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera Ocorrência pelo ID' })
  @ApiOkResponse({ type: OcorrenciaResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.ocorrenciaService.findOne(req['systemId'], id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza Ocorrência' })
  @ApiOkResponse({ type: OcorrenciaResponseDto })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateOcorrenciaDto: UpdateOcorrenciaDto,
  ) {
    return this.ocorrenciaService.update(req['systemId'], id, updateOcorrenciaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Ocorrência' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.ocorrenciaService.remove(req['systemId'], +id);
  }
}

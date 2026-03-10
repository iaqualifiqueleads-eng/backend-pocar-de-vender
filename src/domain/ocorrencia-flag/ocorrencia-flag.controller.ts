import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, NotFoundException } from '@nestjs/common';
import { OcorrenciaFlagService } from './ocorrencia-flag.service';
import { CreateOcorrenciaFlagDto } from './dto/create-ocorrencia-flag.dto';
import { UpdateOcorrenciaFlagDto } from './dto/update-ocorrencia-flag.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { OcorrenciaFlagResponseDto } from './dto/ocorrencia-flag.response.dto';

@Controller('ocorrencia-flag')
@ApiTags('Ocorrencia Flag')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class OcorrenciaFlagController {
  constructor(private readonly ocorrenciaFlagService: OcorrenciaFlagService) { }

  @Post()
  @ApiOperation({ summary: 'Criar Ocorrencia Flag' })
  @ApiCreatedResponse({ type: OcorrenciaFlagResponseDto })
  create(@Req() req: Request, @Body() createOcorrenciaFlagDto: CreateOcorrenciaFlagDto) {
    return this.ocorrenciaFlagService.create(req["systemId"], createOcorrenciaFlagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista de Ocorrencia Flag' })
  @ApiOkResponse({ type: [OcorrenciaFlagResponseDto] })
  findAll(@Req() req: Request, @Query() { page, limit }: PaginationDto) {
    return this.ocorrenciaFlagService.findAll(req["systemId"], { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera Ocorrencia Flag pelo ID' })
  @ApiOkResponse({ type: OcorrenciaFlagResponseDto })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const ocorrenciaFlag = await this.ocorrenciaFlagService.findOne(req["systemId"], id);

    if (!ocorrenciaFlag) {
      throw new NotFoundException('Ocorrencia Flag não encontrado.');
    }

    return ocorrenciaFlag;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza Ocorrencia Flag' })
  @ApiOkResponse({ type: OcorrenciaFlagResponseDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateOcorrenciaFlagDto: UpdateOcorrenciaFlagDto) {
    return this.ocorrenciaFlagService.update(req["systemId"], id, updateOcorrenciaFlagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Ocorrencia Flag' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.ocorrenciaFlagService.remove(req["systemId"], id);
  }
}

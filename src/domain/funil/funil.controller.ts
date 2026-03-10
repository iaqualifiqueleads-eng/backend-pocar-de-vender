import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { FunilService } from './funil.service';
import { CreateFunilDto } from './dto/create-funil.dto';
import { UpdateFunilDto } from './dto/update-funil.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { FunilResponseDto } from './dto/funil.response.dto';

@Controller('funil')
@ApiTags('Funil')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class FunilController {
  constructor(private readonly funilService: FunilService) { }

  @Post()
  @ApiOperation({ summary: 'Criar Funil' })
  @ApiCreatedResponse({ type: FunilResponseDto })
  create(@Req() req: Request, @Body() createFunilDto: CreateFunilDto) {
    return this.funilService.create(req["systemId"], createFunilDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar Funils' })
  @ApiOkResponse({ type: [FunilResponseDto] })
  findAll(@Req() req: Request, @Query() { page = 1, limit = 10 }: PaginationDto) {
    return this.funilService.findAll(req["systemId"], { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera Funil pelo ID' })
  @ApiOkResponse({ type: FunilResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.funilService.findOne(req["systemId"], id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza Funil' })
  @ApiOkResponse({ type: FunilResponseDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateFunilDto: UpdateFunilDto) {
    return this.funilService.update(req["systemId"], id, updateFunilDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Funil' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.funilService.remove(req["systemId"], id);
  }
}

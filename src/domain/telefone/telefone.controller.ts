import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { TelefoneService } from './telefone.service';
import { CreateTelefoneDto } from './dto/create-telefone.dto';
import { UpdateTelefoneDto } from './dto/update-telefone.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { TelefoneResponseDto } from './dto/telefone.response.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('telefone')
@ApiTags('Telefone')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class TelefoneController {
  constructor(private readonly telefoneService: TelefoneService) { }

  @Post()
  @ApiOperation({ summary: 'Criar Telefone' })
  @ApiCreatedResponse({ type: TelefoneResponseDto })
  create(@Req() req: Request, @Body() createTelefoneDto: CreateTelefoneDto) {
    return this.telefoneService.create(req["systemId"], createTelefoneDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera Telefone pelo ID' })
  @ApiOkResponse({ type: TelefoneResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.telefoneService.findOne(req["systemId"], id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza Telefone' })
  @ApiOkResponse({ type: TelefoneResponseDto })
  update(@Req() req: Request, @Body() updateTelefoneDto: UpdateTelefoneDto) {
    return this.telefoneService.update(req["systemId"], updateTelefoneDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Atualiza Telefone' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.telefoneService.remove(req["systemId"], id);
  }

  @Delete('delete/delete-empty-phones')
  @ApiOperation({ summary: 'Remove Telefones Vazios' })
  @ApiOkResponse({ type: String })
  deleteEmptyPhones(@Req() req: Request) {
    return this.telefoneService.deleteEmptyPhones(req["systemId"]);
  }
}

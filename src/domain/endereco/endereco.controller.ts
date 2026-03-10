import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { EnderecoResponseDto } from './dto/endereco.response.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('endereco')
@ApiTags('Endereco')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) { }

  @Post()
  @ApiOperation({ summary: 'Criar Endereco' })
  @ApiCreatedResponse({ type: EnderecoResponseDto })
  create(@Req() req: Request, @Body() createEnderecoDto: CreateEnderecoDto) {
    return this.enderecoService.create(req["systemId"], createEnderecoDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera Endereco pelo ID' })
  @ApiOkResponse({ type: EnderecoResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.enderecoService.findOne(req["systemId"], id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza Endereco' })
  @ApiOkResponse({ type: EnderecoResponseDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateEnderecoDto: UpdateEnderecoDto) {
    return this.enderecoService.update(req["systemId"], id, updateEnderecoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Endereco' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.enderecoService.remove(req["systemId"], id);
  }
}

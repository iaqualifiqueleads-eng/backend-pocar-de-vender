import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { ProdutoResponseDto } from './dto/produto.response.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('produtos')
@ApiTags('Produto')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class ProdutoController {
  constructor(private readonly produtosService: ProdutoService) { }

  @Post()
  @ApiOperation({ summary: 'Criar Produto' })
  @ApiCreatedResponse({ type: ProdutoResponseDto })
  create(@Req() req: Request, @Body() createProdutoDto: CreateProdutoDto) {
    return this.produtosService.create(req["systemId"], createProdutoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar Produtos' })
  @ApiOkResponse({ type: [ProdutoResponseDto] })
  findAll(@Req() req: Request) {
    return this.produtosService.findAll(req["systemId"]);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar Produto' })
  @ApiOkResponse({ type: ProdutoResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.produtosService.findOne(req["systemId"], id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar Produto' })
  @ApiOkResponse({ type: ProdutoResponseDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtosService.update(req["systemId"], id, updateProdutoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove Produtos' })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.produtosService.remove(req["systemId"], id);
  }
}

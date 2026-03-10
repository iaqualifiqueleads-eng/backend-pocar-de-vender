import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { FornecedorService } from './fornecedor.service';
import { CreateFornecedorDto } from './dto/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedor.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { FornecedorResponsedto } from './dto/fornecedor.response.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('fornecedor')
@ApiTags("Fornecedor")
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtGuard)
@UseGuards(SystemIdGuard)
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class FornecedorController {
  constructor(private readonly fornecedorService: FornecedorService) { }

  @Post()
  @ApiOperation({ summary: "Cria Fornecedor" })
  @ApiCreatedResponse({ type: FornecedorResponsedto })
  create(@Req() req: Request, @Body() createFornecedorDto: CreateFornecedorDto) {
    return this.fornecedorService.create(req["systemId"], createFornecedorDto);
  }

  @Get()
  @ApiOperation({ summary: "Lista de Fornecedores" })
  @ApiOkResponse({ type: FornecedorResponsedto })
  findAll(@Req() req: Request, @Query() { page = 1, limit = 10 }: PaginationDto) {
    return this.fornecedorService.findAll(req["systemId"], { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: "Fornecedor por ID" })
  @ApiOkResponse({ type: FornecedorResponsedto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.fornecedorService.findOne(req["systemId"], id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Atualiza Fornecedor por ID" })
  @ApiOkResponse({ type: FornecedorResponsedto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateFornecedorDto: UpdateFornecedorDto) {
    return this.fornecedorService.update(req["systemId"], id, updateFornecedorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Deleta Fornecedor" })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.fornecedorService.remove(req["systemId"], id);
  }
}

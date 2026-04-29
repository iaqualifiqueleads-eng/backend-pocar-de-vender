import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ClienteService, DataToUpdate } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../shared/query-dto/pagination.dto';
import { ClienteResponseDto } from './dto/cliente.response.dto';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { CreateManyClientesDto } from './dto/create-many-clientes.dto';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { ClienteTransferirDto } from './dto/cliente-transferir.dto';
import { ClienteQueryDto } from './dto/cliente.query.dto';
import { DataToCreateTelefones } from './dto/create-telefones.dto';
import { IdsQueryDto } from 'src/common/dtos/ids.dto';
import { Request } from 'express';
import { ListaCnpj } from './dto/lista-cnpj.dto';

@Controller('cliente')
@ApiTags('Cliente')
@UseGuards(SystemIdGuard)
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) { }

  private logger = new Logger;

  @Post()
  @ApiOperation({ summary: 'Criar Cliente' })
  @ApiCreatedResponse({ type: ClienteResponseDto })
  create(@Req() req: Request, @Body() createClienteDto: CreateClienteDto) {    
    return this.clienteService.create(req["systemId"], createClienteDto);
  }

  @Post('create-many')
  @ApiOperation({ summary: 'Criar Varios Clientes' })
  @ApiCreatedResponse({ type: String })
  createMany(@Req() req: Request, @Body() createClienteDto: CreateManyClientesDto) {
    return this.clienteService.createMany(req["systemId"], createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista de Clientes' })
  @ApiOkResponse({ type: ClienteResponseDto, isArray: true })
  findAll(
    @Req() req: Request,
    @Query() { page = 1, limit = 10000 }: PaginationDto,
    @Query() { usuarioId, contatado }: ClienteQueryDto,
  ) {
    this.logger.verbose("[Cliente Controller][FindAll]");

    return this.clienteService.findAll(req["systemId"], {
      page,
      limit,
      usuarioId,
      contatado
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera Cliente pelo ID' })
  @ApiOkResponse({ type: ClienteResponseDto })
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.clienteService.findOne(req["systemId"], id);
  }

  @Get("/clietes/por-usuarios-ids")
  @ApiOperation({ summary: 'Recupera Cliente pelo ID' })
  @ApiOkResponse({ type: ClienteResponseDto })
  findAllByUsuariosIds(@Req() req: Request, @Query() { ids }: IdsQueryDto) {
    this.logger.verbose("[Cliente Controller][All By user ID]");
    
    const _ids = ids ? ids?.split(',') : [req.user["sub"]]

    return this.clienteService.findAllByUsuariosIds(req["systemId"], _ids);
  }

  @Get("/update-all-clientes-to-possivel-cliente-false/update-all-clientes-to-possivel-cliente-false")
  @ApiOperation({ summary: 'Atualiza Cliente' })
  @ApiOkResponse({ type: String })
  updateAllClientesToPossivelClienteFalse(@Req() req: Request) {
    return this.clienteService.updateAllClientesToPossivelClienteFalse(req["systemId"]);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza Cliente' })
  @ApiOkResponse({ type: ClienteResponseDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(req["systemId"], id, updateClienteDto);
  }

  @Patch('/tranferir/usuario')
  @ApiOperation({ summary: 'transferir Clientes' })
  @ApiOkResponse({ type: String })
  tranferirClientes(@Req() req: Request, @Body() clienteTransferirDto: ClienteTransferirDto) {
    return this.clienteService.tranferirClientes(req["systemId"], clienteTransferirDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Remove cliente" })
  @ApiOkResponse({ type: String })
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.clienteService.remove(req["systemId"], id);
  }

  @Get("123/delete-for-error")
  deleteForError(@Req() req: Request) {
    return this.clienteService.deleteForError(req["systemId"]);
  }

  @Post("update-telefones")
  async updateTelefone(@Req() req: Request, @Body() data: DataToUpdate) {
    return this.clienteService.updateTelefone(req["systemId"], data)
  }

  @Post("create-telefones")
  async createTelefones(@Req() req: Request, @Body() data: DataToCreateTelefones) {
    return this.clienteService.createTelefones(req["systemId"], data)
  }

  @Get("clientes-sem-telefone/clietes-sem-telefone")
  async clientesSemTelefone(@Req() req: Request) {
    return this.clienteService.clientesSemTelefone(req["systemId"])
  }

  @Post("update-clientes/na-base")
  async updateclientesNaBase(@Req() req: Request, @Body() data: ListaCnpj) {
    return this.clienteService.updateclientesNaBase(req["systemId"], data)
  }

  @Post("update-clientes-origem/gislene")
  async updateOrigemCliente(@Req() req: Request, @Body() data: ListaCnpj) {
    return this.clienteService.updateOrigemCliente(req["systemId"], data)
  }

  @Post("delete-clientes/delete-many")
  async deleteMany(@Req() req: Request, @Body() data: ListaCnpj) {
    return this.clienteService.deleteMany(req["systemId"], data)
  }

  //////////////////////////////////////////////////////
  @Post('update/cliente/usuario/cnpj')
  async updateUsuariosByCNPJ(@Req() req: Request, @Body() data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    return this.clienteService.updateUsuariosByCNPJ(req["systemId"], data)
  }

  @Post('update/cliente/usuario/nome')
  async updateUsuariosByNome(@Req() req: Request, @Body() data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    return this.clienteService.updateUsuariosByNome(req["systemId"], data)
  }

  @Post('update/cliente/origem/by/nome')
  async updateOrigemByNome(@Req() req: Request, @Body() data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    return this.clienteService.updateOrigemByNome(req["systemId"], data)
  }

  @Post('update/cliente/origem/by/cnpj')
  async updateOrigemByCNPJ(@Req() req: Request, @Body() data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]) {
    return this.clienteService.updateOrigemByCNPJ(req["systemId"], data)
  }

  @Post('cadastrar/nome/cnpj/origem/usuario')
  async cadastrarVarios(@Req() req: Request, @Body() data: { "rotulos_de_linha": string, "vendedor": string, "cnpj": string, "origem": string }[]){
    return this.clienteService.cadastrarVarios(req['systemId'], data)
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransferenciaClienteService } from './transferencia-cliente.service';
import { CreateTransferenciaClienteDto } from './dto/create-transferencia-cliente.dto';
import { UpdateTransferenciaClienteDto } from './dto/update-transferencia-cliente.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('transferencia-cliente')
@ApiTags('Transferência de Cliente')
export class TransferenciaClienteController {
  constructor(private readonly transferenciaClienteService: TransferenciaClienteService) { }

  @Post()
  create(@Body() createTransferenciaClienteDto: CreateTransferenciaClienteDto) {
    return this.transferenciaClienteService.create(createTransferenciaClienteDto);
  }

  @Get()
  findAll() {
    return this.transferenciaClienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transferenciaClienteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransferenciaClienteDto: UpdateTransferenciaClienteDto) {
    return this.transferenciaClienteService.update(+id, updateTransferenciaClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transferenciaClienteService.remove(+id);
  }
}

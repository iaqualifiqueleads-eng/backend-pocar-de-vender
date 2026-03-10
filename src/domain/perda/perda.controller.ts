import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PerdaService } from './perda.service';
import { CreatePerdaDto } from './dto/create-perda.dto';
import { UpdatePerdaDto } from './dto/update-perda.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('perda')
@ApiTags('Perda')
export class PerdaController {
  constructor(private readonly perdaService: PerdaService) { }

  @Post()
  create(@Body() createPerdaDto: CreatePerdaDto) {
    return this.perdaService.create(createPerdaDto);
  }

  @Get()
  findAll() {
    return this.perdaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perdaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerdaDto: UpdatePerdaDto) {
    return this.perdaService.update(+id, updatePerdaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perdaService.remove(+id);
  }
}

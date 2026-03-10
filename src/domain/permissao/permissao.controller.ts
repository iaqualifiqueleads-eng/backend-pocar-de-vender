import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissaoService } from './permissao.service';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('permissao')
@ApiTags('Permissão')
export class PermissaoController {
  constructor(private readonly permissaoService: PermissaoService) { }

  @Post()
  create(@Body() createPermissaoDto: CreatePermissaoDto) {
    return this.permissaoService.create(createPermissaoDto);
  }

  @Get()
  findAll() {
    return this.permissaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissaoDto: UpdatePermissaoDto) {
    return this.permissaoService.update(+id, updatePermissaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissaoService.remove(+id);
  }
}

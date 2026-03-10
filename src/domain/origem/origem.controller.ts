import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrigemService } from './origem.service';
import { CreateOrigemDto } from './dto/create-origem.dto';
import { UpdateOrigemDto } from './dto/update-origem.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { SystemIdGuard } from 'src/common/guards/system-id.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';



@Controller('origem')
@ApiTags('Origem')
@UseGuards(SystemIdGuard)
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@ApiHeader({
  name: 'x-system-id',
  example: 'pocar_de_vender_0',
  description: 'ID do sistema',
  required: true,
})
export class OrigemController {
  constructor(private readonly origemService: OrigemService) {}

  @Post()
  create(@Req() req: Request, @Body() createOrigemDto: CreateOrigemDto) {
    return this.origemService.create(req["systemId"], createOrigemDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.origemService.findAll(req["systemId"]);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.origemService.findOne(req["systemId"], id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() updateOrigemDto: UpdateOrigemDto) {
    return this.origemService.update(req["systemId"], id, updateOrigemDto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.origemService.remove(req["systemId"], id);
  }
}

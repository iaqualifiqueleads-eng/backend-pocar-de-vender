import { Injectable } from '@nestjs/common';
import { CreatePerdaDto } from './dto/create-perda.dto';
import { UpdatePerdaDto } from './dto/update-perda.dto';

@Injectable()
export class PerdaService {
  create(createPerdaDto: CreatePerdaDto) {
    return 'This action adds a new perda';
  }

  findAll() {
    return `This action returns all perda`;
  }

  findOne(id: number) {
    return `This action returns a #${id} perda`;
  }

  update(id: number, updatePerdaDto: UpdatePerdaDto) {
    return `This action updates a #${id} perda`;
  }

  remove(id: number) {
    return `This action removes a #${id} perda`;
  }
}

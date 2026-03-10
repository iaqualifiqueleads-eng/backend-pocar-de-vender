import { Injectable } from '@nestjs/common';
import { CreatePermissaoDto } from './dto/create-permissao.dto';
import { UpdatePermissaoDto } from './dto/update-permissao.dto';

@Injectable()
export class PermissaoService {
  create(createPermissaoDto: CreatePermissaoDto) {
    return 'This action adds a new permissao';
  }

  findAll() {
    return `This action returns all permissao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissao`;
  }

  update(id: number, updatePermissaoDto: UpdatePermissaoDto) {
    return `This action updates a #${id} permissao`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissao`;
  }
}

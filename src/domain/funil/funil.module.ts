import { Module } from '@nestjs/common';
import { FunilService } from './funil.service';
import { FunilController } from './funil.controller';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funil } from './entities/funil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Funil])],
  controllers: [FunilController],
  providers: [FunilService, JwtService],
  exports: [FunilService],
})
export class FunilModule { }

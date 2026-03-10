import { Module } from '@nestjs/common';
import { OrigemService } from './origem.service';
import { OrigemController } from './origem.controller';
import { Origem } from './entities/origem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Origem])],
  controllers: [OrigemController],
  providers: [OrigemService, JwtService],
  exports: [OrigemService]
})
export class OrigemModule {}
